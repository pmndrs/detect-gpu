// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import { isWebGLSupported, getBenchmarkByPercentage } from './utilities';

const device = new Device();

const gl = isWebGLSupported({
  failIfMajorPerformanceCaveat: true,
});

const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

function getGPUTier(shouldLogToConsole, mobileBenchmarkPercentages, desktopBenchmarkPercentages) {
  if (!gl || !glExtensionDebugRendererInfo) {
    if (device.mobile || device.tablet) {
      return 'GPU_MOBILE_TIER_0';
    }

    return 'GPU_DESKTOP_TIER_0';
  }

  // Mobile devices
  // --------------

  // Samsung S9+
  // const renderer = 'Mali-G72'.toLowerCase(); // Does not work

  // Samsung S9
  // const renderer = 'Mali-G72'.toLowerCase(); // Does not work

  // Samsung S8
  // const renderer = 'Mali-G71'.toLowerCase(); // Does not work

  // Samsung S8+
  // const renderer = 'Mali-G71'.toLowerCase(); // Does not work

  // Samsung Galaxy S7
  // const renderer = 'Mali-T880'.toLowerCase();

  // Samsung Galaxy S7
  // const renderer = 'Mali-T760'.toLowerCase();

  // Samsung Galaxy S5
  // const renderer = 'Mali-T628'.toLowerCase();

  // Samsung Galaxy S4
  // const renderer = 'Adreno (TM) 320'.toLowerCase();

  // Google Pixel 2
  // const renderer = 'Adreno (TM) 540'.toLowerCase();

  // Google Pixel
  // const renderer = 'Adreno (TM) 530'.toLowerCase();

  // Google Pixel XL
  // const renderer = 'Adreno (TM) 530'.toLowerCase();

  // Google Nexus 6P
  // const renderer = 'Adreno (TM) 430'.toLowerCase();

  // Google Nexus 5X
  // const renderer = 'Adreno (TM) 418'.toLowerCase();

  // Google Nexus 6
  // const renderer = 'Adreno (TM) 420'.toLowerCase();

  // Google Nexus 5
  // const renderer = 'Adreno (TM) 330'.toLowerCase();

  // Google Nexus 9
  // const renderer = 'NVIDIA Tegra'.toLowerCase(); // Does not work

  // Google Nexus 7
  // const renderer = 'Adreno (TM) 320'.toLowerCase();

  // LG G5
  // const renderer = 'Adreno (TM) 530'.toLowerCase();

  // Motorola Moto X 2nd Gen
  // const renderer = 'Adreno (TM) 330'.toLowerCase();

  // Motorola Moto G 2nd Gen
  // const renderer = 'Adreno (TM) 305'.toLowerCase();

  // Motorola G4
  // const renderer = 'Adreno (TM) 405'.toLowerCase();

  // iPhone X
  // const renderer = 'Apple A11 GPU'.toLowerCase();

  // iPhone 8
  // const renderer = 'Apple A11 GPU'.toLowerCase();

  // iPhone 8 Plus
  // const renderer = 'Apple A11 GPU'.toLowerCase();

  // iPhone SE
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPhone 6S Plus
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPhone 6S
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPad Mini 2
  // const renderer = 'Apple A7 GPU'.toLowerCase();

  // iPad 2017
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPhone 5C
  // const renderer = 'PowerVR SGX 543'.toLowerCase(); // Does not work

  // iPhone SE
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPad 6th
  // const renderer = 'Apple A10 GPU'.toLowerCase();

  // iPad 5th
  // const renderer = 'Apple A9 GPU'.toLowerCase();

  // iPad Pro
  // const renderer = 'Apple A9X GPU'.toLowerCase();

  // iPad Air 2
  // const renderer = 'Apple A8X GPU'.toLowerCase();

  // iPad Mini 3
  // const renderer = 'Apple A7 GPU'.toLowerCase();

  // iPhone 5S
  // const renderer = 'Apple A8 GPU'.toLowerCase();

  // Desktop
  // -------

  // const renderer = 'AMD Radeon R9 390X'.toLowerCase();
  // const renderer = 'Apple A11 GPU'.toLowerCase();
  // const renderer = 'NVIDIA GeForce GTX 750 Series'.toLowerCase();
  const renderer = glExtensionDebugRendererInfo
    && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

  if (!renderer) {
    if (device.mobile || device.tablet) {
      return 'GPU_MOBILE_TIER_1';
    }

    return 'GPU_DESKTOP_TIER_1';
  }

  const versionNumber = parseInt(renderer.replace(/[\D]/g, ''), 10);

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

  if (GPU_BLACKLIST) {
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

    let mobileTier;

    mobileBenchmarkTiers.some((rawTier, i) => rawTier.some((rawEntry) => {
        const entry = rawEntry
          .toLowerCase()
          // Remove prelude score
          .split('- ')[1]
          // Entries like 'apple a9x / powervr series 7xt' give problems
          // with the 7 being picked up (resulting in a tier 3 classification of A7 chip which should be tier 1).
          .split(' /')[0];
        const entryVersion = parseInt(entry.replace(/[\D]/g, ''), 10);

        if (
          (entry.includes('adreno') && isRendererAdreno)
          || (entry.includes('apple') && isRendererApple)
          || (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali)
          || (entry.includes('mali-t') && isRendererMaliT)
          || (entry.includes('nvidia') && isRendererNVIDIA)
          || (entry.includes('powervr') && isRendererPowerVR)
        ) {
          if (entryVersion === versionNumber) {
            if (shouldLogToConsole) {
              console.log(`Match with benchmark entry: ${entry}`);
            }

            mobileTier = `GPU_MOBILE_TIER_${i}`;
          }
        }
      }));

    if (mobileTier === undefined) {
      if (shouldLogToConsole) {
        console.log('Matching GPU tier could not be found, using fallback: GPU_MOBILE_TIER_1');
      }

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
        // with the 7 being picked up (resulting in a tier 3 classification of A7 chip which should be tier 1).
        .split(' /')[0];
      const entryVersion = parseInt(entry.replace(/[\D]/g, ''), 10);

      if (
        (entry.includes('intel') && isRendererIntel)
        || (entry.includes('amd') && isRendererAMD)
        || (entry.includes('nvidia') && isRendererNVIDIA)
      ) {
        if (entryVersion === versionNumber) {
          if (shouldLogToConsole) {
            console.log(`Match with benchmark entry: ${entry}`);
          }

          desktopTier = `GPU_DESKTOP_TIER_${i}`;
        }
      }
    }));

  if (desktopTier === undefined) {
    if (shouldLogToConsole) {
      console.log('Matching GPU tier could not be found, using fallback: GPU_DESKTOP_TIER_1');
    }

    desktopTier = 'GPU_DESKTOP_TIER_1';
  }

  return desktopTier;
}

export function register(options = {}) {
  this.shouldLogToConsole = false;

  // Benchmark listing is reversed so that if multiple instances of a GPU is found the highest one is used
  // Take for example G72, it is reported only as G72 to the browser but can mean G72 MP3, G72 MP12 and G72 MP18.
  // It will in this case take the highest tier in order to be future proof (assuming G72 becomes more powerful over time)

  // Desktop GPU percentages
  // 15% TIER_0
  // 35% TIER_1
  // 30% TIER_2
  // 20% TIER_3
  this.benchmarkTierPercentagesMobile = [15, 35, 30, 20];

  // Mobile GPU percentages
  // 15% TIER_0
  // 35% TIER_1
  // 30% TIER_2
  // 20% TIER_3
  this.benchmarkTierPercentagesDesktop = [15, 35, 30, 20];

  Object.assign(this, options);

  const GPU_TIER = getGPUTier(
    this.shouldLogToConsole,
    this.benchmarkTierPercentagesMobile,
    this.benchmarkTierPercentagesDesktop,
  );

  return GPU_TIER;
}
