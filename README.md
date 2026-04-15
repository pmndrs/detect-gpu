# @pmndrs/detect-gpu

[![npm version](https://img.shields.io/npm/v/@pmndrs/detect-gpu.svg)](https://www.npmjs.com/package/@pmndrs/detect-gpu)
[![npm downloads](https://img.shields.io/npm/dm/@pmndrs/detect-gpu.svg)](https://www.npmjs.com/package/@pmndrs/detect-gpu)
[![gzip size](https://img.badgesize.io/https:/unpkg.com/@pmndrs/detect-gpu/dist/index.mjs?compression=gzip)](https://unpkg.com/@pmndrs/detect-gpu)

> **Migrating from `detect-gpu`?** This package has moved to `@pmndrs/detect-gpu`. Update your imports:
>
> ```diff
> - import { getGPUTier } from 'detect-gpu';
> + import { getGPUTier } from '@pmndrs/detect-gpu';
> ```

Classifies GPUs based on their 3D rendering benchmark score allowing the developer to provide sensible default settings for graphically intensive applications. Think of it like a user-agent detection for the GPU but more powerful.

> **Note:** Our benchmark data source ([gfxbench.com](https://gfxbench.com)) stopped updating in December 2025. The current data remains accurate for existing GPUs, but we are exploring alternative data sources for future updates. See [#132](https://github.com/pmndrs/detect-gpu/issues/132) for progress.

## Demo

[Live demo](https://pmndrs.github.io/detect-gpu/)

## Installation

```sh
pnpm add @pmndrs/detect-gpu
```

```sh
npm install @pmndrs/detect-gpu
```

```sh
yarn add @pmndrs/detect-gpu
```

## Self-hosting benchmark data

By default benchmark data is loaded from the [UNPKG](https://unpkg.com) CDN (`https://unpkg.com/@pmndrs/detect-gpu@{version}/dist/benchmarks`). To serve it yourself (e.g. for offline environments, strict CSP, or to avoid a third-party CDN):

1. Download [benchmarks.tar.gz](https://github.com/pmndrs/detect-gpu/raw/master/benchmarks.tar.gz) and extract it into a publicly served directory — for example `public/benchmarks/` in your app.
2. Point `getGPUTier` at that URL via the `benchmarksURL` option:

```ts
const gpuTier = await getGPUTier({
  benchmarksURL: '/benchmarks',
});
```

The directory must be served at the exact URL passed in — `detect-gpu` appends filenames like `/benchmarks-d-*.json` to it when fetching.

## Usage

```ts
import { getGPUTier } from '@pmndrs/detect-gpu';

const gpuTier = await getGPUTier();

// Example output:
// {
//   "tier": 1,
//   "isMobile": false,
//   "type": "BENCHMARK",
//   "fps": 21,
//   "gpu": "intel iris graphics 6100"
// }
```

`detect-gpu` uses rendering benchmark scores (framerate, normalized by resolution) in order to determine what tier should be assigned to the user's GPU. If no `WebGLContext` can be created, the GPU is blocklisted or the GPU has reported to render on less than `15 fps` `tier: 0` is assigned. One should provide a fallback to a non-WebGL experience.

Based on the reported `fps` the GPU is then classified into either `tier: 1 (>= 15 fps)`, `tier: 2 (>= 30 fps)` or `tier: 3 (>= 60 fps)`. The higher the tier the more graphically intensive workload you can offer to the user.

## Result types

`getGPUTier()` returns a `type` field indicating how the result was produced:

| `type`                   | Meaning                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `BENCHMARK`              | Matched a benchmark entry; `fps` reflects the measured framerate for that GPU.      |
| `FALLBACK`               | Renderer recognised but no benchmark match found. `tier` is a conservative default. |
| `BENCHMARK_FETCH_FAILED` | Benchmark fetch failed (CDN outage, strict CSP, offline, etc.). Safe to retry.      |
| `BLOCKLISTED`            | Renderer is on a known-bad list (drivers with severe issues). `tier` is always 0.   |
| `WEBGL_UNSUPPORTED`      | No WebGL context could be created. `tier` is always 0.                              |
| `SSR`                    | Running server-side — no `window`, detection skipped.                               |

The `fps` field is populated only for `BENCHMARK` results. All other `type` values leave `fps` as `undefined`.

## API

```ts
getGPUTier({
  /**
   * URL of directory where benchmark data is hosted.
   *
   * @default https://unpkg.com/@pmndrs/detect-gpu@{version}/dist/benchmarks
   */
  benchmarksURL?: string;
  /**
   * Optionally pass in a WebGL context to avoid creating a temporary one
   * internally.
   */
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  /**
   * Whether to fail if the system performance is low or if no hardware GPU is
   * available.
   *
   * @default false
   */
  failIfMajorPerformanceCaveat?: boolean;
  /**
   * Framerate per tier for mobile devices.
   *
   * @defaultValue [0, 15, 30, 60]
   */
  mobileTiers?: number[];
  /**
   * Framerate per tier for desktop devices.
   *
   * @defaultValue [0, 15, 30, 60]
   */
  desktopTiers?: number[];
  /**
   * Optionally override specific parameters. Used mainly for testing.
   */
  override?: {
    renderer?: string;
    /**
     * Override whether device is an iPad.
     */
    isIpad?: boolean;
    /**
     * Override whether device is a mobile device.
     */
    isMobile?: boolean;
    /**
     * Override device screen size.
     */
    screenSize?: { width: number; height: number };
    /**
     * Override how benchmark data is loaded
     */
    loadBenchmarks?: (file: string) => Promise<ModelEntry[]>;
  };
})
```

## Requirements

- Node.js 24+
- ESM only (CommonJS is not supported)

## Support

All modern browsers that support WebGL are supported.

## Changelog

[Changelog](CHANGELOG.md)

## License

Released under the [MIT license](https://raw.githubusercontent.com/pmndrs/detect-gpu/master/LICENSE).

`@pmndrs/detect-gpu` uses both mobile and desktop benchmarking scores from [https://gfxbench.com](https://gfxbench.com).
