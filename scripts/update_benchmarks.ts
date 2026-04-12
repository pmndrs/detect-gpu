/* eslint-disable @typescript-eslint/no-explicit-any */

// Vendor
import fs, { createReadStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { parse } from 'csv-parse';
import * as tar from 'tar';

// Application
import { BLOCKLISTED_GPUS } from '../src/internal/blocklistedGPUS.ts';
import { cleanRenderer } from '../src/internal/cleanRenderer.ts';
import { getGPUVersion } from '../src/internal/getGPUVersion.ts';
import { tokenizeForLevenshteinDistance } from '../src/internal/getLevenshteinDistance.ts';
import { internalBenchmarkResults } from './internalBenchmarkResults.ts';
import type { BenchmarkRow } from './types.ts';

// Package
import pkg from '../package.json' with { type: 'json' };
const { version } = pkg;

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

const CSV_URL =
  'https://raw.githubusercontent.com/Kishonti-Opensource/GFXBench_and_CompuBench_results/main/GFXBench-5.0-results.csv';
const CACHE_DIR = path.resolve('./scripts/.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'gfxbench-5.0.csv');
const MANHATTAN_TEST_ID = '544';

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

async function downloadCsvIfMissing() {
  if (fs.existsSync(CACHE_FILE)) {
    console.log(`Using cached CSV at ${CACHE_FILE}`);
    return;
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`Downloading ${CSV_URL}`);
  const response = await fetch(CSV_URL);
  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to download CSV: ${response.status} ${response.statusText}`
    );
  }
  await pipeline(
    response.body as unknown as NodeJS.ReadableStream,
    fs.createWriteStream(CACHE_FILE)
  );
  console.log(`Cached CSV at ${CACHE_FILE}`);
}

async function fetchBenchmarks(): Promise<BenchmarkRow[]> {
  await downloadCsvIfMissing();

  const parser = createReadStream(CACHE_FILE).pipe(
    parse({ columns: true, skip_empty_lines: true, relax_quotes: true })
  );

  const rows: BenchmarkRow[] = [];
  for await (const record of parser) {
    if (record['test id'] !== MANHATTAN_TEST_ID) continue;

    const formatted = record['best result (formatted)'] ?? '';
    if (formatted.startsWith('Failed')) continue;

    const fps = Math.round(Number(record['median result (fps)']));
    if (!Number.isFinite(fps) || fps <= 0) continue;

    const resolution = record['screen size'];
    if (!resolution || resolution.startsWith('-1')) continue;

    const hardwareName = record['hardware name'];
    const deviceName = record['device name'];
    const formFactor = record['form factor'] ?? '';
    if (!hardwareName || !deviceName) continue;

    rows.push({
      date: '',
      device: deviceName.toLowerCase(),
      fps,
      gpu: hardwareName,
      mobile: formFactor.includes('mobile'),
      resolution,
    });
  }

  console.log(`Parsed ${rows.length} Manhattan benchmark rows from CSV`);
  return rows;
}
