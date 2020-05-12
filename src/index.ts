// Generated data
import {
  GPU_BENCHMARK_SCORE_DESKTOP,
  GPU_BENCHMARK_SCORE_MOBILE,
} from './__generated__/GPUBenchmark';

// Internal
import { cleanEntryString } from './internal/cleanEntryString';
import { cleanRendererString } from './internal/cleanRendererString';
import { getBenchmarkByPercentage } from './internal/getBenchmarkByPercentage';
import { browser, isMobile, isTablet } from './internal/getBrowserType';
import { getEntryVersionNumber } from './internal/getEntryVersionNumber';
import { getWebGLUnmaskedRenderer } from './internal/getWebGLUnmaskedRenderer';
import { isWebGLSupported } from './internal/isWebGLSupported';

export interface IGetGPUTier {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  mobileBenchmarkPercentages?: number[];
  desktopBenchmarkPercentages?: number[];
  forceRendererString?: string;
  forceMobile?: boolean;
  failIfMajorPerformanceCaveat?: boolean;
}

export const getGPUTier = ({
  mobileBenchmarkPercentages = [
    0, // TIER_0
    50, // TIER_1
    30, // TIER_2
    20, // TIER_3
  ],
  desktopBenchmarkPercentages = [
    0, // TIER_0
    50, // TIER_1
    30, // TIER_2
    20, // TIER_3
  ],
  forceRendererString = '',
  forceMobile = false,
  glContext,
  failIfMajorPerformanceCaveat = true,
}: IGetGPUTier = {}): { tier: string; type: string } => {
  let renderer: string;
  let mobileTier = isMobile || isTablet || forceMobile;

  const createGPUTier = (index: number = 1, type: string = 'FALLBACK') => ({
    tier: `GPU_${mobileTier ? 'MOBILE' : 'DESKTOP'}_TIER_${index}`,
    type,
  });

  if (forceRendererString) {
    renderer = forceRendererString;
  } else {
    const gl = glContext || isWebGLSupported(browser, failIfMajorPerformanceCaveat);

    if (!gl) {
      return createGPUTier(0, 'WEBGL_UNSUPPORTED');
    }

    renderer = getWebGLUnmaskedRenderer(gl);
  }

  renderer = cleanRendererString(renderer);
  // GPU BLACKLIST
  // https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
  // https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
  // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/software_rendering_list.json
  // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/gpu_driver_bug_list.json
  const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|mali-4|mali-3|mali-2)/.test(
    renderer
  );

  if (isGPUBlacklisted) {
    return createGPUTier(0, 'BLACKLISTED');
  }
  const [tier, type] = (mobileTier ? getMobileRank : getDesktopRank)(
    getBenchmarkByPercentage(
      mobileTier ? GPU_BENCHMARK_SCORE_MOBILE : GPU_BENCHMARK_SCORE_DESKTOP,
      mobileTier ? mobileBenchmarkPercentages : desktopBenchmarkPercentages
    ),
    renderer,
    getEntryVersionNumber(renderer)
  );

  return createGPUTier(tier, type);
};

const getMobileRank = (benchmark: string[][], renderer: string, rendererVersionNumber: string) => {
  const type = ['adreno', 'apple', 'mali-t', 'mali', 'nvidia', 'powervr'].find(type =>
    renderer.includes(type)
  );

  if (type) {
    for (let index = 0; index < benchmark.length; index++) {
      const benchmarkTier = benchmark[index];
      for (let i = 0; i < benchmarkTier.length; i++) {
        const entry = cleanEntryString(benchmarkTier[i]);
        if (
          entry.includes(type) &&
          (entry !== 'mali' || !entry.includes('mali-t')) &&
          getEntryVersionNumber(entry).includes(rendererVersionNumber)
        ) {
          return [index, `BENCHMARK - ${entry}`] as [number, string];
        }
      }
    }
  }
  // Handle mobile edge cases
  return [undefined, undefined] as [undefined, undefined];
};

const getDesktopRank = (benchmark: string[][], renderer: string, rendererVersionNumber: string) => {
  const type = ['intel', 'amd', 'nvidia'].find(type => renderer.includes(type));
  if (type) {
    for (let index = 0; index < benchmark.length; index++) {
      const benchmarkTier = benchmark[index];
      for (let i = 0; i < benchmarkTier.length; i++) {
        const entry = cleanEntryString(benchmarkTier[i]);
        if (entry.includes(type) && getEntryVersionNumber(entry).includes(rendererVersionNumber)) {
          return [index, `BENCHMARK - ${entry}`] as [number, string];
        }
      }
    }
  }
  // Handle desktop edge cases
  return [undefined, undefined] as [undefined, undefined];
};
