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
import { getLevenshteinDistance } from './internal/getLevenshteinDistance';

// Types
export interface IGetGPUTier {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  mobileBenchmarkPercentages?: number[];
  desktopBenchmarkPercentages?: number[];
  failIfMajorPerformanceCaveat?: boolean;
  forceRendererString?: string;
  forceMobile?: boolean;
}

export type TRank = [number, string] | [undefined, undefined];
export interface IRankWithDistance {
  rank: TRank;
  distance: number;
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
  const isMobileTier = isMobile || isTablet || forceMobile;

  const createGPUTier = (
    index: number = 1,
    GPUType: string = 'FALLBACK'
  ): { tier: string; type: string } => ({
    tier: `GPU_${isMobileTier ? 'MOBILE' : 'DESKTOP'}_TIER_${index}`,
    type: GPUType,
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
  const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon r9 200|mali-4|mali-3|mali-2|google swiftshader|sgx543|legacy|sgx 543)/.test(
    renderer
  );

  if (isGPUBlacklisted) {
    return createGPUTier(0, 'BLACKLISTED');
  }

  const [tier, type] = (isMobileTier ? getMobileRank : getDesktopRank)(
    getBenchmarkByPercentage(
      isMobileTier ? GPU_BENCHMARK_SCORE_MOBILE : GPU_BENCHMARK_SCORE_DESKTOP,
      isMobileTier ? mobileBenchmarkPercentages : desktopBenchmarkPercentages
    ),
    renderer,
    getEntryVersionNumber(renderer)
  );

  return createGPUTier(tier, type);
};

const getMobileRank = (
  benchmark: string[][],
  renderer: string,
  rendererVersionNumber: string
): TRank => {
  const type = [
    'adreno',
    'apple',
    'mali-t',
    'mali',
    'nvidia',
    'powervr',
  ].find((rendererType: string): boolean => renderer.includes(rendererType));

  const ranks: IRankWithDistance[] = [];
  if (type) {
    for (let index = 0; index < benchmark.length; index++) {
      const benchmarkTier = benchmark[index];

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < benchmarkTier.length; i++) {
        const entry = cleanEntryString(benchmarkTier[i]);

        if (
          entry.includes(type) &&
          (entry !== 'mali' || !entry.includes('mali-t')) &&
          getEntryVersionNumber(entry).includes(rendererVersionNumber)
        ) {
          ranks.push({
            rank: [index, `BENCHMARK - ${entry}`],
            distance: getLevenshteinDistance(renderer, entry),
          });
        }
      }
    }
  }

  const ordered = sortByLevenshteinDistance(ranks);
  return ordered.length > 0 ? ordered[0].rank : [undefined, undefined];
};

const sortByLevenshteinDistance = (ranks: IRankWithDistance[]): IRankWithDistance[] =>
  ranks.sort(
    (rank1: IRankWithDistance, rank2: IRankWithDistance): number => rank1.distance - rank2.distance
  );

const getDesktopRank = (
  benchmark: string[][],
  renderer: string,
  rendererVersionNumber: string
): TRank => {
  const type = ['intel', 'amd', 'nvidia'].find((rendererType: string): boolean =>
    renderer.includes(rendererType)
  );

  const ranks: IRankWithDistance[] = [];
  if (type) {
    for (let index = 0; index < benchmark.length; index++) {
      const benchmarkTier = benchmark[index];

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < benchmarkTier.length; i++) {
        const entry = cleanEntryString(benchmarkTier[i]);

        if (entry.includes(type) && getEntryVersionNumber(entry).includes(rendererVersionNumber)) {
          ranks.push({
            rank: [index, `BENCHMARK - ${entry}`],
            distance: getLevenshteinDistance(renderer, entry),
          });
        }
      }
    }
  }

  const ordered = sortByLevenshteinDistance(ranks);
  return ordered.length > 0 ? ordered[0].rank : [undefined, undefined];
};
