/* eslint-disable @typescript-eslint/no-explicit-any */

// Vendor
import puppeteer from 'puppeteer';
import fs from 'fs';

// Application
import { BLOCKLISTED_GPUS } from '../src/internal/blocklistedGPUS';
import { getGPUVersion } from '../src/internal/getGPUVersion';
import { internalBenchmarkResults } from './internalBenchmarkResults';
import { BenchmarkRow } from './types';

// Package
import { version } from '../package.json';

const BENCHMARK_URL = `https://gfxbench.com/result.jsp?benchmark=gfx50&test=544&text-filter=&order=median&ff-lmobile=true&ff-smobile=true&os-Android_gl=true&os-Android_vulkan=true&os-iOS_gl=true&os-iOS_metal=true&os-Linux_gl=true&os-OS_X_gl=true&os-OS_X_metal=true&os-Windows_dx=true&os-Windows_dx12=true&os-Windows_gl=true&os-Windows_vulkan=true&pu-dGPU=true&pu-iGPU=true&pu-GPU=true&arch-ARM=true&arch-unknown=true&arch-x86=true&base=device`;

const TYPES = [
  'adreno',
  'apple',
  'mali-t',
  'mali',
  'nvidia',
  'powervr',
  'intel',
  'amd',
  'radeon',
  'nvidia',
  'geforce',
];

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

(async () => {
  let benchmarks = await fetchBenchmarks();
  benchmarks.push(...internalBenchmarkResults);
  benchmarks = benchmarks
    .map((benchmark) => {
      benchmark.gpu = benchmark.gpu
        .toLowerCase()
        .replace(/\s*\([^)]+(\))/g, '')
        .replace(/(\d+)\/[^ ]+/, '$1')
        .replace(
          /x\.org |inc\. |open source technology center |imagination technologies |™ |nvidia corporation |apple inc\. |advanced micro devices, inc\. | series$| edition$| graphics$/g,
          ''
        )
        .replace(/(qualcomm|adreno)[^ ] /g, 'qualcomm ')
        .replace(/qualcomm (qualcomm )+/g, 'qualcomm ')
        .trim();
      benchmark.device = benchmark.device.toLowerCase();
      return benchmark;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  await Promise.all([true, false].map(exportBenchmarks));

  async function exportBenchmarks(isMobile: boolean): Promise<any> {
    const rows = benchmarks.filter(
      ({ mobile, gpu }) =>
        mobile === isMobile &&
        TYPES.filter((type): boolean => gpu.includes(type)).length > 0
    );

    const rowsByGpu = Object.values(
      rows.reduce((groupedByKey, row) => {
        const groupKey = row.gpu;
        (groupedByKey[groupKey] = groupedByKey[groupKey] || []).push(row);
        return groupedByKey;
      }, {} as Record<string, BenchmarkRow[]>)
    );

    return Promise.all([
      ...TYPES.map(async (type) => {
        const devicesByGpu = rowsByGpu
          .filter(([{ gpu }]) => gpu.includes(type))
          .map((rows) => {
            const { gpu } = rows[0];
            const blocklisted = BLOCKLISTED_GPUS.find((blocklistedModel) =>
              gpu.includes(blocklistedModel)
            );
            const devices = Object.entries(
              rows.reduce(
                (
                  fpsByResolution: { [k: string]: [string, number] },
                  { resolution, fps, device }
                ) => {
                  fpsByResolution[resolution] = [
                    device,
                    blocklisted ? -1 : fps,
                  ];
                  return fpsByResolution;
                },
                {}
              )
            )
              .map(([resolution, [device, fps]]) => {
                const [width, height] = resolution.split(' x ').map(Number);
                return { width, height, fps, device };
              })
              .sort(
                ({ width: aW, height: aH }, { width: bW, height: bH }) =>
                  aW * aH - bW * bH
              );
            return {
              blocklisted,
              devices,
              gpu,
              gpuVersion: getGPUVersion(gpu),
            };
          });

        if (devicesByGpu.length === 0) {
          return Promise.resolve();
        }
        const outputFile = async (
          type: string,
          models: typeof devicesByGpu
        ) => {
          const serializedModels = models.map(
            ({ gpu, gpuVersion, blocklisted, devices }) => [
              gpu,
              gpuVersion,
              blocklisted ? 1 : 0,
              devices.map(({ width, height, fps, device }) =>
                isMobile ? [width, height, fps, device] : [width, height, fps]
              ),
            ]
          );
          const file = `./benchmarks/${isMobile ? 'm' : 'd'}-${type}.json`;
          const data = JSON.stringify([version, ...serializedModels]);
          await fs.promises.writeFile(file, data);
          console.log(`Exported ${file}`);
        };

        // Output ipads seperately from other ios devices:
        if (type === 'apple' && isMobile) {
          await Promise.all([
            outputFile(
              'apple-ipad',
              devicesByGpu
                .map((gpu) => ({
                  ...gpu,
                  devices: gpu.devices.filter(({ device }) =>
                    device.includes('ipad')
                  ),
                }))
                .filter(({ devices }) => devices.length > 0)
            ),
            outputFile(
              'apple',
              devicesByGpu
                .map((gpu) => ({
                  ...gpu,
                  devices: gpu.devices.filter(
                    ({ device }) => !device.includes('ipad')
                  ),
                }))
                .filter(({ devices }) => devices.length > 0)
            ),
          ]);
        } else {
          await outputFile(type, devicesByGpu);
        }
      }),
      // outputFile(getOutputFilename(`all-${isMobile ? 'm' : 'd'}`), rowsByGpu),
    ]);
  }
})().catch((err) => {
  throw err;
});

async function fetchBenchmarks() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(BENCHMARK_URL, { waitUntil: 'networkidle2' });

  const benchmarks = await page.evaluate((): BenchmarkRow[] => {
    const {
      firstResult,
      deviceName,
      fpses,
      gpuNameLookup,
      screenSizeLookup,
      screenSizes,
      gpuName,
      formFactorLookup,
      formFactor,
    } = window as unknown as {
      firstResult: string[];
      deviceName: string[];
      fpses: string[];
      gpuNameLookup: string[];
      screenSizeLookup: string[];
      screenSizes: number[];
      gpuName: number[];
      formFactorLookup: string[];
      formFactor: number[];
    };

    return gpuName
      .map(
        (gpuIndex, index): Optional<BenchmarkRow, 'fps'> => ({
          date: firstResult[index],
          device: deviceName[index].toLowerCase(),
          fps:
            fpses[index] === ''
              ? undefined
              : Math.round(Number(fpses[index].replace(/[^\d.]+/g, ''))),
          gpu: gpuNameLookup[gpuIndex],
          mobile: formFactorLookup[formFactor[index]].includes('mobile'),
          resolution: screenSizeLookup[screenSizes[index]],
        })
      )
      .filter((row): row is BenchmarkRow => row.fps !== undefined);
  });
  await browser.close();
  return benchmarks;
}
