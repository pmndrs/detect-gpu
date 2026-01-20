/* eslint-disable @typescript-eslint/no-explicit-any */

// Vendor
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import * as tar from 'tar';

// Application
import { BLOCKLISTED_GPUS } from '../src/internal/blocklistedGPUS';
import { cleanRenderer } from '../src/internal/cleanRenderer';
import { getGPUVersion } from '../src/internal/getGPUVersion';
import { tokenizeForLevenshteinDistance } from '../src/internal/getLevenshteinDistance';
import { internalBenchmarkResults } from './internalBenchmarkResults';
import { BenchmarkRow } from './types';

// Package
import { version } from '../package.json';

const libraryMajorVersion = version.split('.')[0];

//* Directory Setup ==============================
const BENCHMARKS_DIR = path.resolve('./benchmarks');
const BENCHMARKS_MIN_DIR = path.resolve('./benchmarks-min');

// Ensure directories exist (cross-platform mkdir -p)
function ensureDirectories() {
  fs.rmSync(BENCHMARKS_DIR, { recursive: true, force: true });
  fs.rmSync(BENCHMARKS_MIN_DIR, { recursive: true, force: true });
  fs.mkdirSync(BENCHMARKS_DIR, { recursive: true });
  fs.mkdirSync(BENCHMARKS_MIN_DIR, { recursive: true });
}

// Create tar.gz archive and cleanup (cross-platform)
async function createArchiveAndCleanup() {
  await tar.create(
    {
      gzip: true,
      file: 'benchmarks.tar.gz',
      cwd: '.',
    },
    [path.basename(BENCHMARKS_MIN_DIR)]
  );
  console.log('Created benchmarks.tar.gz');
  
  // Cleanup benchmarks-min directory
  fs.rmSync(BENCHMARKS_MIN_DIR, { recursive: true, force: true });
}

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
  'samsung'
];

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

(async () => {
  // Setup directories (cross-platform)
  ensureDirectories();
  
  let benchmarks = await fetchBenchmarks();
  benchmarks.push(...internalBenchmarkResults);
  benchmarks = benchmarks
    .map((benchmark) => {
      benchmark.gpu = cleanRenderer(benchmark.gpu)
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
    .sort((a, b) => a.gpu.localeCompare(b.gpu));

  await Promise.all([true, false].map(exportBenchmarks));
  
  // Create archive and cleanup (cross-platform)
  await createArchiveAndCleanup();

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
              tokenizeForLevenshteinDistance(gpu),
              blocklisted ? 1 : 0,
              devices.map(({ width, height, fps, device }) =>
                isMobile ? [width, height, fps, device] : [width, height, fps]
              ),
            ]
          );
          const data = [libraryMajorVersion, ...serializedModels];
          await Promise.all(
            [true, false].map(async (minified) => {
              const file = `./benchmarks${minified ? '-min' : ''}/${
                isMobile ? 'm' : 'd'
              }-${type}.json`;
              const json = JSON.stringify(data, null, minified ? undefined : 2);
              await fs.promises.writeFile(file, json);
              if (!minified) {
                console.log(`Exported ${file}`);
              }
            })
          );
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
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Set a realistic user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(BENCHMARK_URL, { waitUntil: 'networkidle2' });

  // Wait for the data to be available on window (max 30 seconds)
  await page.waitForFunction(() => typeof (window as any).gpuName !== 'undefined', {
    timeout: 30000,
  }).catch(async () => {
    // Debug: log what's available on the page
    const availableVars = await page.evaluate(() => {
      const vars = ['gpuName', 'deviceName', 'fpses', 'gpuNameLookup', 'firstResult', 'formFactor'];
      return vars.map((v) => `${v}: ${typeof (window as any)[v]}`).join(', ');
    });
    console.error('Expected window variables not found. Available:', availableVars);
    throw new Error('Benchmark data not available on page. The website structure may have changed.');
  });

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
