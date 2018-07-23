// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import {
  isWebGLSupported,
  matchHigherNumericVersion,
  matchLowerNumericVersion,
  matchNumericRange,
  getBenchmarkByPercentage,
} from './utilities';

const device = new Device();
const gl = isWebGLSupported();
const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
const unmaskedRenderer = glExtensionDebugRendererInfo
  && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
const renderer = unmaskedRenderer || gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();

// S6
// const renderer = 'Mali-T760'.toLowerCase();

// S8
// const renderer = 'Mali-G71'.toLowerCase();

// Pixel 2
// const renderer = 'Adreno (TM) 540'.toLowerCase();

// iPhone 5s
// const renderer = 'WebGL 1.0 (OpenGL ES 2.0 Apple A8 GPU - 50.6.11)'.toLowerCase();

// iPhone 6S
// const renderer = 'Apple A10 GPU'.toLowerCase();

function getGPUTier(mobileBenchmarkPercentages, desktopBenchmarkPercentages) {
  const mobileBenchmarkTiers = getBenchmarkByPercentage(
    BENCHMARK_SCORE_MOBILE,
    mobileBenchmarkPercentages,
  );

  const desktopBenchmarkTiers = getBenchmarkByPercentage(
    BENCHMARK_SCORE_DESKTOP,
    desktopBenchmarkPercentages,
  );

  // GPU_BLACKLIST
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

  if (device.mobile || device.tablet) {
    // Mobile
    const isRendererAdreno = renderer.includes('adreno');
    const isRendererApple = renderer.includes('apple');
    const isRendererMali = renderer.includes('mali') && !renderer.includes('mali-t');
    const isRendererMaliT = renderer.includes('mali-t');
    const isRendererNVIDIA = renderer.includes('nvidia');
    const isRendererPowerVR = renderer.includes('powervr');

    const isBenchmarkAdreno = [];
    const isBenchmarkApple = [];
    const isBenchmarkMali = [];
    const isBenchmarkMaliT = [];
    const isBenchmarkNVIDIA = [];
    const isBenchmarkPowerVR = [];

    BENCHMARK_SCORE_MOBILE.some((rawEntry) => {
      const entry = rawEntry.toLowerCase();

      if (entry.includes('adreno')) {
        isBenchmarkAdreno.push(entry);
        return;
      }

      if (entry.includes('apple')) {
        isBenchmarkApple.push(entry);
        return;
      }

      if (entry.includes('mali') && !entry.includes('mali-t')) {
        isBenchmarkMali.push(entry);
        return;
      }

      if (entry.includes('mali-t')) {
        isBenchmarkMaliT.push(entry);
        return;
      }

      if (entry.includes('nvidia')) {
        isBenchmarkNVIDIA.push(entry);
        return;
      }

      if (entry.includes('powervr')) {
        isBenchmarkPowerVR.push(entry);
      }
    });

    // GPU_MOBILE_TIER_0
    // - iOS < A7
    // - iPhone 5s, iPad Air, iPad mini 3, iPad mini 2 - Apple A7 GPU
    // - Google Nexus 7 - Adreno 320
    // - Nexus 5 - Adreno 330
    if (
      (isRendererApple
        && (renderer.includes('a6') || renderer.includes('a5') || renderer.includes('a4')))
      || (isRendererAdreno && (renderer.includes('320') || renderer.includes('330')))
    ) {
      return 'GPU_MOBILE_TIER_0';
    }

    // GPU_MOBILE_TIER_1 - DEFAULT
    // - iOS => A7 < A9
    // - iPhone 6, iPhone 6 Plus, iPad Air 2, iPad mini 4, iPod touch (6th generation) - Apple A8 GPU
    // - Nexus 5X - Adreno 418
    // - Nexus 6P - Adreno 430
    if (
      (isRendererApple
        && (renderer.includes('a7') || renderer.includes('a8') || renderer.includes('a9')))
      || (isRendererAdreno && (renderer.includes('418') || renderer.includes('430')))
    ) {
      return 'GPU_MOBILE_TIER_1';
    }

    // GPU_MOBILE_TIER_2
    // - iOS => A9 <= A10
    // - iPhone 6s, iPhone 6s Plus, iPhone SE, iPad (5th generation), iPad Pro (12.9-inch), iPad Pro (9.7-inch) - Apple A9 GPU
    // - Galaxy S7 - Mali t880 / Adreno 530
    // - Pixel - Adreno 530
    // - Pixel XL - Adreno 530
    // - Pixel 2 - Adreno 540
    // - Galaxy Note 8 - Mali G71 / Adreno 540
    // - Galaxy S8 Plus - Mali G71 Adreno 540
    // - Galaxy S8 - Mali G71 / Adreno 540
    if (
      (isRendererApple && (renderer.includes('a9') || renderer.includes('a10')))
      || (isRendererAdreno && (renderer.includes('530') || renderer.includes('540')))
      || (isRendererMali && renderer.includes('g71'))
      || (isRendererMaliT && renderer.includes('880'))
    ) {
      return 'GPU_MOBILE_TIER_2';
    }

    // GPU_MOBILE_TIER_3
    // - iOS >= A10
    // - iPhone 7, iPhone 7 Plus, iPad Pro 12.9-inch (2nd generation), iPad Pro (10.5-inch) - Apple A10 GPU
    // - iPhone 8, iPhone 8 Plus, iPhone X - Apple A11 GPU
    // - Galaxy S9 - Mali G72 / Adreno 630
    // - Galaxy S9 Plus - Mali G72 / Adreno 630
    // - NVIDIA Tegra - NVIDIA Maxwell GPU
    // - Pixel C - NVIDIA Maxwell GPU
    if (
      (isRendererApple && (renderer.includes('a10') || renderer.includes('a11')))
      || (isRendererAdreno && renderer.includes('630'))
      || (isRendererMali && renderer.includes('g72'))
      || (isRendererNVIDIA && renderer.includes('maxwell'))
    ) {
      return 'GPU_MOBILE_TIER_3';
    }

    // DEFAULT
    return 'GPU_MOBILE_TIER_1';
  }

  // Desktop
  const isRendererIntel = renderer.includes('intel');
  const isRendererAMD = renderer.includes('amd');
  const isRendererNVIDIA = renderer.includes('nvidia');
  const versionNumber = parseInt(renderer.slice().replace(/[\D]/g, ''), 10);
  console.log(versionNumber);

  desktopBenchmarkTiers.map((rawTier) => {
    rawTier.map((rawEntry) => {
      if (isRendererIntel) {
        if (rawEntry.includes('intel')) {
          // ?
        }
      }

      console.log(rawEntry);
      // console.log(
      //   parseInt(
      //     rawEntry
      //       .split('-')[1]
      //       .slice()
      //       .replace(/[\D]/g, ''),
      //     10,
      //   ),
      // );
    });
  });

  // const isBenchmarkIntel = [];
  // const isBenchmarkAMD = [];
  // const isBenchmarkNVIDIA = [];

  // BENCHMARK_SCORE_DESKTOP.some((rawEntry) => {
  //   const entry = rawEntry.toLowerCase();

  //   if (entry.includes('intel')) {
  //     isBenchmarkIntel.push(entry);
  //     return;
  //   }

  //   if (entry.includes('amd')) {
  //     isBenchmarkAMD.push(entry);
  //     return;
  //   }

  //   if (entry.includes('nvidia')) {
  //     isBenchmarkNVIDIA.push(entry);
  //   }
  // });

  // console.log(isRendererIntel, isBenchmarkIntel);

  // GPU_DESKTOP_TIER_0
  // Intel HD graphics 1000 - 4000

  // GPU_DESKTOP_TIER_1 - DEFAULT
  // Everything except NVIDIA and AMD (dedicated graphics cards)

  // GPU_DESKTOP_TIER_2
  // - NVIDIA
  // - AMD

  // GPU_DESKTOP_TIER_3
  // - Titan
  // - AMD Radeon Pro

  // DEFAULT
  return 'GPU_DESKTOP_TIER_1';
}

export function register(options = {}) {
  Object.assign(this, options);

  // Benchmark listing is reversed so that the array ordering
  // matches up with the rest of the program:

  // 15% TIER_0
  // 35% TIER_1
  // 30% TIER_2
  // 20% TIER_3
  this.BENCHMARK_TIER_PERCENTAGES_MOBILE = [15, 35, 30, 20];
  this.BENCHMARK_TIER_PERCENTAGES_DESKTOP = [15, 35, 30, 20];

  const GPU_TIER = getGPUTier(
    this.BENCHMARK_TIER_PERCENTAGES_MOBILE,
    this.BENCHMARK_TIER_PERCENTAGES_DESKTOP,
  );

  return {
    GPU_TIER,
    BENCHMARK_SCORE_DESKTOP,
    BENCHMARK_SCORE_MOBILE,
  };
}
