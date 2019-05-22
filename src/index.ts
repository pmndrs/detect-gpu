// Generated data
import {
  GPU_BENCHMARK_SCORE_DESKTOP,
  GPU_BENCHMARK_SCORE_MOBILE,
} from './__generated__/GPUBenchmark';

// Modules
import { getBenchmarkByPercentage } from './getBenchmarkByPercentage';
import { isDesktop, isMobile, isTablet } from './getBrowserType';
import { getWebGLUnmaskedRenderer } from './getWebGLUnmaskedRenderer';
import { isWebGLSupported } from './isWebGLSupported';

const cleanEntryString = (entryString: string): string =>
  entryString
    .toLowerCase() // Lowercase all for easier matching
    .split('- ')[1] // Remove prelude score (`3 - `)
    .split(' /')[0]; // Reduce 'apple a9x / powervr series 7xt' to 'apple a9x'

const getEntryVersionNumber = (entryString: string): string => entryString.replace(/[\D]/g, ''); // Grab and concat all digits in the string

const cleanRendererString = (rendererString: string): string => {
  let cleanedRendererString = rendererString.toLowerCase();

  // Strip off ANGLE and Direct3D version
  if (cleanedRendererString.includes('angle (') && cleanedRendererString.includes('direct3d')) {
    cleanedRendererString = cleanedRendererString.replace('angle (', '').split(' direct3d')[0];
  }

  // Strip off the GB amount (1060 6gb was being concatenated to 10606 and because of it using the fallback)
  if (cleanedRendererString.includes('nvidia') && cleanedRendererString.includes('gb')) {
    cleanedRendererString = cleanedRendererString.split(/\dgb/)[0];
  }

  return cleanedRendererString;
};

export interface IGetGPUTier {
  mobileBenchmarkPercentages?: number[];
  desktopBenchmarkPercentages?: number[];
  forceRendererString?: string;
  forceMobile?: boolean;
}

export const getGPUTier = (options: IGetGPUTier = {}): { tier: string; type: string } => {
  const mobileBenchmarkPercentages: number[] = options.mobileBenchmarkPercentages || [
    0, // TIER_0
    50, // TIER_1
    30, // TIER_2
    20, // TIER_3
  ];
  const desktopBenchmarkPercentages: number[] = options.desktopBenchmarkPercentages || [
    0, // TIER_0
    50, // TIER_1
    30, // TIER_2
    20, // TIER_3
  ];
  const forceRendererString = options.forceRendererString || '';
  const forceMobile = options.forceMobile || false;

  let renderer;
  let tier = '';
  let type = '';

  if (!forceRendererString) {
    const gl = isWebGLSupported();

    if (!gl) {
      if (isMobile || isTablet || forceMobile) {
        return {
          tier: 'GPU_MOBILE_TIER_0',
          type: 'WEBGL_UNSUPPORTED',
        };
      }

      return {
        tier: 'GPU_DESKTOP_TIER_0',
        type: 'WEBGL_UNSUPPORTED',
      };
    }

    renderer = getWebGLUnmaskedRenderer(gl);
  } else {
    renderer = forceRendererString;
  }

  renderer = cleanRendererString(renderer);
  const rendererVersionNumber = renderer.replace(/[\D]/g, '');

  // GPU BLACKLIST
  // https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
  // https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
  // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/software_rendering_list.json
  // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/gpu_driver_bug_list.json
  const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|mali-4|mali-3|mali-2)/.test(
    renderer
  );

  if (isGPUBlacklisted) {
    if (isMobile || isTablet || forceMobile) {
      return {
        tier: 'GPU_MOBILE_TIER_0',
        type: 'BLACKLISTED',
      };
    }

    return {
      tier: 'GPU_DESKTOP_TIER_0',
      type: 'BLACKLISTED',
    };
  }

  if (isMobile || isTablet || forceMobile) {
    const mobileBenchmark = getBenchmarkByPercentage(
      GPU_BENCHMARK_SCORE_MOBILE,
      mobileBenchmarkPercentages
    );

    const isRendererAdreno = renderer.includes('adreno');
    const isRendererApple = renderer.includes('apple');
    const isRendererMali = renderer.includes('mali') && !renderer.includes('mali-t');
    const isRendererMaliT = renderer.includes('mali-t');
    const isRendererNVIDIA = renderer.includes('nvidia');
    const isRendererPowerVR = renderer.includes('powervr');

    mobileBenchmark.forEach((benchmarkTier, index) =>
      benchmarkTier.forEach(benchmarkEntry => {
        const entry = cleanEntryString(benchmarkEntry);
        const entryVersionNumber = getEntryVersionNumber(entry);

        if (
          (entry.includes('adreno') && isRendererAdreno) ||
          (entry.includes('apple') && isRendererApple) ||
          (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali) ||
          (entry.includes('mali-t') && isRendererMaliT) ||
          (entry.includes('nvidia') && isRendererNVIDIA) ||
          (entry.includes('powervr') && isRendererPowerVR)
        ) {
          if (entryVersionNumber.includes(rendererVersionNumber)) {
            tier = `GPU_MOBILE_TIER_${index}`;
            type = `BENCHMARK - ${entry}`;
          }

          // Handle mobile edge cases
        }
      })
    );

    if (!tier) {
      tier = 'GPU_MOBILE_TIER_1';
      type = 'FALLBACK';
    }

    return {
      tier,
      type,
    };
  }

  if (isDesktop) {
    const desktopBenchmark = getBenchmarkByPercentage(
      GPU_BENCHMARK_SCORE_DESKTOP,
      desktopBenchmarkPercentages
    );

    const isRendererIntel = renderer.includes('intel');
    const isRendererAMD = renderer.includes('amd');
    const isRendererNVIDIA = renderer.includes('nvidia');

    desktopBenchmark.forEach((benchmarkTier, index) =>
      benchmarkTier.forEach(benchmarkEntry => {
        const entry = cleanEntryString(benchmarkEntry);
        const entryVersionNumber = getEntryVersionNumber(entry);

        if (
          (entry.includes('intel') && isRendererIntel) ||
          (entry.includes('amd') && isRendererAMD) ||
          (entry.includes('nvidia') && isRendererNVIDIA)
        ) {
          if (entryVersionNumber.includes(rendererVersionNumber)) {
            tier = `GPU_DESKTOP_TIER_${index}`;
            type = `BENCHMARK - ${entry}`;
          }

          // Handle desktop edge cases
        }
      })
    );

    if (!tier) {
      tier = 'GPU_DESKTOP_TIER_1';
      type = 'FALLBACK';
    }

    return {
      tier,
      type,
    };
  }

  return {
    tier,
    type,
  };
};
