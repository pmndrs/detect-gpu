# CHANGELOG

# 2.0.0

## API

```ts
import { getGPUTier } from 'detect-gpu';

const GPUTier = getGPUTier({
  glContext: gl, // Optionally pass in a WebGL context to avoid creating a temporary one internally
  mobileBenchmarkPercentages: [0, 50, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
  desktopBenchmarkPercentages: [0, 50, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
  failIfMajorPerformanceCaveat: true, // (Default) Fail to detect if the WebGL implementation determines the performance would be dramatically lower than the equivalent OpenGL implementation
  forceRendererString: 'Apple A11 GPU', // (Development) Force a certain renderer string
  forceMobile: true, // (Development) Force the use of mobile benchmarking scores
});

// Example output:
// {
//   "tier": GPU_DESKTOP_TIER_1,
//   "type": "BENCHMARK - intel iris graphics 6100",
// }
```

turns into

```ts
import { getGPUTier } from 'detect-gpu';

(async () => {
  const gpuTier = await getGPUTier({
    glContext?: WebGLRenderingContext | WebGL2RenderingContext; // (Default, undefined) Optionally pass in a WebGL context to avoid creating a temporary one internally
    failIfMajorPerformanceCaveat?: boolean; // (Default, true) Fail to detect if the WebGL implementation determines the performance would be dramatically lower than the equivalent OpenGL
    mobileTiers?: number[]; // (Default, [0, 15, 30, 60]) Framerate per tier
    desktopTiers?: number[]; // (Default, [0, 15, 30, 60]) Framerate per tier
    override?: { // (Default, false) Override specific functionality, useful for development
      renderer?: string; // Manually override reported GPU renderer string
      isIpad?: boolean; // Manually report device as being an iPad
      isMobile?: boolean; // Manually report device as being a mobile device
      screenSize?: { width: number; height: number }; // Manually adjust reported screenSize
      loadBenchmarks?: (file: string) => Promise<TModelEntry[] | undefined>; // Optionally modify method for loading benchmark data
    };
    benchmarksURL?: string; // (Default, /benchmarks) Provide location of where to access benchmark data
  })

  // Example output:
  // {
  //   "tier": 1,
  //   "isMobile": false,
  //   "type": "BENCHMARK",
  //   "fps": 21,
  //   "gpu": "intel iris graphics 6100"
  // }
});
```

Please note that `getGPUTier` now returns a `Promise`, this wasn't the case before.

Please note that the benchmark tier is now picked based on a `resolution normalized fps` instead of dividing the benchmark list into % chuncks and determining it that way.

## Benchmark data

Previously the benchmark data was included inside of the `detect-gpu` bundle. By default we now use the benchmark data served on `https://unpkg.com/detect-gpu@${pkg.version}/benchmarks` but you can also serve the benchmark data yourself.

This is possible by downloading [benchmarks.tar.gz](https://github.com/TimvanScherpenzeel/detect-gpu/raw/benchmark-delivery/benchmarks.tar.gz) and serving it from a public directory on your webserver (optimal, prevents loading of redundant benchmarks) like this:

```ts
// Application
import { getGPUTier } from '../src';

(async () => {
  const data = await getGPUTier({
    benchmarksURL: '/benchmarks',
  });
})();
```
