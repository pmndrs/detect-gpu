// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import { getBenchmarkByPercentage, getWebGLUnmaskedRenderer } from './utilities';

// Instantiate device detection
const device = new Device();

function cleanEntryString(entryString) {
  return entryString
    .toLowerCase() // Lowercase all for easier matching
    .split('- ')[1] // Remove prelude score (`3 - `)
    .split(' /')[0]; // Reduce 'apple a9x / powervr series 7xt' to 'apple a9x'
}

function getEntryVersionNumber(entryString) {
  return entryString.replace(/[\D]/g, ''); // Grab and concat all digits in the string
}

function cleanRendererString(rendererString) {
  // Strip off ANGLE and Direct3D version
  if (rendererString.includes('angle (') && rendererString.includes('direct3d')) {
    rendererString = rendererString.replace('angle (', '').split(' direct3d')[0];
  }

  // // Strip off the GB amount (1060 6gb was being concatenated to 10606 and because of it using the fallback)
  if (rendererString.includes('nvidia') && rendererString.includes('gb')) {
    rendererString = rendererString.split(/\dgb/)[0];
  }

  return rendererString.toLowerCase();
}

export function getGPUTier(options = {}) {
  this.mobileBenchmarkPercentages = [15, 35, 30, 20];
  this.desktopBenchmarkPercentages = [15, 35, 30, 20];
  this.forceRendererString = false;
  this.forceMobile = false;

  Object.assign(this, options);

  const isMobile = device.mobile || device.tablet || this.forceMobile;
  const isDesktop = !isMobile;

  let renderer;
  let tier;
  let type;

  if (this.forceRendererString === false) {
    renderer = getWebGLUnmaskedRenderer();
  } else {
    renderer = this.forceRendererString;
  }

  // WebGL support is missing
  if (!renderer) {
    if (isMobile) {
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

  renderer = cleanRendererString(renderer);
  const rendererVersionNumber = renderer.replace(/[\D]/g, '');

  // GPU BLACKLIST
  // - https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
  // - https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
  // - https://chromium.googlesource.com/chromium/src/gpu/+/master/config/software_rendering_list.json
  const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|radeon r9 200|mali-4|mali-3|mali-2)/.test(
    renderer,
  );

  if (isGPUBlacklisted) {
    if (isMobile) {
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

  if (isMobile) {
    const mobileBenchmark = getBenchmarkByPercentage(
      BENCHMARK_SCORE_MOBILE,
      this.mobileBenchmarkPercentages,
    );

    const isRendererAdreno = renderer.includes('adreno');
    const isRendererApple = renderer.includes('apple');
    const isRendererMali = renderer.includes('mali') && !renderer.includes('mali-t');
    const isRendererMaliT = renderer.includes('mali-t');
    const isRendererNVIDIA = renderer.includes('nvidia');
    const isRendererPowerVR = renderer.includes('powervr');

    mobileBenchmark.forEach((benchmarkTier, index) => benchmarkTier.forEach((benchmarkEntry) => {
        const entry = cleanEntryString(benchmarkEntry);
        const entryVersionNumber = getEntryVersionNumber(entry);

        if (
          (entry.includes('adreno') && isRendererAdreno)
          || (entry.includes('apple') && isRendererApple)
          || (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali)
          || (entry.includes('mali-t') && isRendererMaliT)
          || (entry.includes('nvidia') && isRendererNVIDIA)
          || (entry.includes('powervr') && isRendererPowerVR)
        ) {
          if (entryVersionNumber.includes(rendererVersionNumber)) {
            tier = `GPU_MOBILE_TIER_${index}`;
            type = `BENCHMARK - ${entry}`;
          }

          // Handle mobile edge cases
        }
      }));

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
      BENCHMARK_SCORE_DESKTOP,
      this.desktopBenchmarkPercentages,
    );

    const isRendererIntel = renderer.includes('intel');
    const isRendererAMD = renderer.includes('amd');
    const isRendererNVIDIA = renderer.includes('nvidia');

    desktopBenchmark.forEach((benchmarkTier, index) => benchmarkTier.forEach((benchmarkEntry) => {
        const entry = cleanEntryString(benchmarkEntry);
        const entryVersionNumber = getEntryVersionNumber(entry);

        if (
          (entry.includes('intel') && isRendererIntel)
          || (entry.includes('amd') && isRendererAMD)
          || (entry.includes('nvidia') && isRendererNVIDIA)
        ) {
          if (entryVersionNumber.includes(rendererVersionNumber)) {
            tier = `GPU_DESKTOP_TIER_${index}`;
            type = `BENCHMARK - ${entry}`;
          }

          // Handle desktop edge cases

          // NVIDIA Titan does not have a version number preventing it from being picked up
          // if (isRendererNVIDIA && renderer.includes('titan')) {
          //   tier = 'GPU_DESKTOP_TIER_3';
          //   type = `BENCHMARK_FORCED - ${entry}`;
          // }
        }
      }));

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
}
