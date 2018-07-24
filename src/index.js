// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import { isWebGLSupported, getBenchmarkByPercentage } from './utilities';

const device = new Device();
const gl = isWebGLSupported();
const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
const renderer = glExtensionDebugRendererInfo
  && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
const versionNumber = parseInt(renderer.replace(/[\D]/g, ''), 10);

// Blacklisted GPU
// const renderer = 'radeon hd 6970m';

// Example GTX 1080 Ti
// const renderer = 'NVIDIA GeForce GTX 1080 Ti (Desktop)'.toLowerCase();

// S6
// const renderer = 'Mali-T760'.toLowerCase();

// S8
// const renderer = 'Mali-G72'.toLowerCase();

// Pixel 2
// const renderer = 'Adreno (TM) 540'.toLowerCase();

// iPhone 5s
// const renderer = 'WebGL 1.0 (OpenGL ES 2.0 Apple A8 GPU - 50.6.11)'.toLowerCase();

// iPhone 6S
// const renderer = 'Apple A7 GPU'.toLowerCase();

function getGPUTier(mobileBenchmarkPercentages, desktopBenchmarkPercentages) {
  const mobileBenchmarkTiers = getBenchmarkByPercentage(
    BENCHMARK_SCORE_MOBILE,
    mobileBenchmarkPercentages,
  );

  const desktopBenchmarkTiers = getBenchmarkByPercentage(
    BENCHMARK_SCORE_DESKTOP,
    desktopBenchmarkPercentages,
  );

  // GPU BLACKLIST
  // - https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
  // - https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
  // - https://chromium.googlesource.com/chromium/src/gpu/+/master/config/software_rendering_list.json
  const GPU_BLACKLIST = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|radeon r9 200|mali-4|mali-3|mali-2)/.test(
    renderer,
  );

  if (!gl || GPU_BLACKLIST) {
    if (device.mobile || device.tablet) {
      return 'GPU_MOBILE_TIER_0';
    }

    return 'GPU_DESKTOP_TIER_0';
  }

  if (!renderer) {
    if (device.mobile || device.tablet) {
      return 'GPU_MOBILE_TIER_1';
    }

    return 'GPU_DESKTOP_TIER_1';
  }

  if (device.mobile || device.tablet) {
    // Mobile
    const isRendererAdreno = renderer.includes('adreno');
    const isRendererApple = renderer.includes('apple');
    const isRendererMali = renderer.includes('mali') && !renderer.includes('mali-t');
    const isRendererMaliT = renderer.includes('mali-t');
    const isRendererNVIDIA = renderer.includes('nvidia');
    const isRendererPowerVR = renderer.includes('powervr');

    let mobileTier;

    mobileBenchmarkTiers.some((rawTier, i) => rawTier.some((rawEntry) => {
        const entry = rawEntry
          .toLowerCase()
          // Remove prelude score
          .split('- ')[1]
          // Entries like 'apple a9x / powervr series 7xt' give problems
          // with the 7 being picked up (resulting in a tier 3 classification of A7 chip
          // which should be tier 1).
          .split('/')[0];

        if (
          (entry.includes('adreno') && isRendererAdreno)
          || (entry.includes('apple') && isRendererApple)
          || (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali)
          || (entry.includes('mali-t') && isRendererMaliT)
          || (entry.includes('nvidia') && isRendererNVIDIA)
          || (entry.includes('powervr') && isRendererPowerVR)
        ) {
          if (entry.includes(versionNumber)) {
            mobileTier = `GPU_MOBILE_TIER_${i}`;
          }
        }
      }));

    if (mobileTier === undefined) {
      console.log('Matching GPU tier could not be found, using fallback: GPU_MOBILE_TIER_1');
      mobileTier = 'GPU_MOBILE_TIER_1';
    }

    return mobileTier;
  }

  // Desktop
  const isRendererIntel = renderer.includes('intel');
  const isRendererAMD = renderer.includes('amd');
  const isRendererNVIDIA = renderer.includes('nvidia');
  let desktopTier;

  desktopBenchmarkTiers.forEach((rawTier, i) => rawTier.forEach((rawEntry) => {
      const entry = rawEntry
        .toLowerCase()
        // Remove prelude score
        .split('- ')[1]
        // Entries like 'apple a9x / powervr series 7xt' give problems
        // with the 7 being picked up (resulting in a tier 3 classification of A7 chip
        // which should be tier 1).
        .split('/')[0];

      if (
        (entry.includes('intel') && isRendererIntel)
        || (entry.includes('amd') && isRendererAMD)
        || (entry.includes('nvidia') && isRendererNVIDIA)
      ) {
        if (entry.includes(versionNumber)) {
          desktopTier = `GPU_DESKTOP_TIER_${i}`;
        }
      }
    }));

  if (desktopTier === undefined) {
    console.log('Matching GPU tier could not be found, using fallback: GPU_DESKTOP_TIER_1');
    desktopTier = 'GPU_DESKTOP_TIER_1';
  }

  return desktopTier;
}

export function register(options = {}) {
  Object.assign(this, options);

  // Benchmark listing is reversed so that if multiple instances of a GPU is found the highest one is used
  // Take for example G72, it is reported only as G72 to the browser but can mean G72 MP3, G72 MP12 and G72 MP18.
  // It will in this case take the highest tier in order to be future proof (assuming G72 becomes more powerful over time)

  // Desktop GPU percentages
  // 15% TIER_0
  // 35% TIER_1
  // 30% TIER_2
  // 20% TIER_3
  this.BENCHMARK_TIER_PERCENTAGES_MOBILE = [15, 35, 30, 20];

  // Mobile GPU percentages
  // 15% TIER_0
  // 35% TIER_1
  // 30% TIER_2
  // 20% TIER_3
  this.BENCHMARK_TIER_PERCENTAGES_DESKTOP = [15, 35, 30, 20];

  const GPU_TIER = getGPUTier(
    this.BENCHMARK_TIER_PERCENTAGES_MOBILE,
    this.BENCHMARK_TIER_PERCENTAGES_DESKTOP,
  );

  return {
    GPU_TIER,
    DETECTED_RENDERER: renderer,
  };
}
