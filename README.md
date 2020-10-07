# Detect GPU

[![npm version](https://badge.fury.io/js/detect-gpu.svg)](https://badge.fury.io/js/detect-gpu)

Classify GPU's based on their benchmark score in order to provide an adaptive experience.

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install detect-gpu
```

## Usage

```js
import { getGPUTier } from 'detect-gpu';

(async () => {
  const gpuTier = await getGPUTier({
    glContext?: WebGLRenderingContext | WebGL2RenderingContext; // Optionally pass in a WebGL context to avoid creating a temporary one internally
    failIfMajorPerformanceCaveat?: boolean; // Fail to detect if the WebGL implementation determines the performance would be dramatically lower than the equivalent OpenGL
    mobileTiers?: number[];
    desktopTiers?: number[];
    debug?: boolean;
    override?: {
      renderer?: string;
      isIpad?: boolean;
      isMobile?: boolean;
      screen?: { width: number; height: number };
      loadBenchmarks?: (file: string) => Promise<TModelEntry[] | undefined>;
    };
    benchmarksURL?: string;
  })
});
```

## Licence

My work is released under the [MIT license](https://raw.githubusercontent.com/TimvanScherpenzeel/detect-gpu/master/LICENSE).

`detect-gpu` uses both mobile and desktop benchmarking scores from [https://gfxbench.com](https://gfxbench.com).
