// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import { isWebGLSupported, getBenchmarkByPercentage } from './utilities';

function getGPUTier(
  verbose,
  mobileBenchmarkPercentages,
  desktopBenchmarkPercentages,
  forceRenderer,
  forceMobile,
) {
  let device = {};
  let gl;
  let glExtensionDebugRendererInfo;
  let matchedBenchmarkEntry = '';

  if (!forceRenderer) {
    gl = isWebGLSupported({
      failIfMajorPerformanceCaveat: true,
    });

    glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
  }

  if (forceMobile) {
    device.mobile = true;
    device.tablet = true;
  } else {
    device = new Device();
  }

  if (!forceRenderer && (!gl || !glExtensionDebugRendererInfo)) {
    if (device.mobile || device.tablet) {
      return { tier: 'GPU_MOBILE_TIER_0' };
    }

    return { tier: 'GPU_DESKTOP_TIER_0' };
  }

  let renderer;

  if (!forceRenderer) {
    renderer = glExtensionDebugRendererInfo
      && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
  } else {
    renderer = forceRenderer;
  }

  if (!renderer) {
    if (device.mobile || device.tablet) {
      return { tier: 'GPU_MOBILE_TIER_1' };
    }

    return { tier: 'GPU_DESKTOP_TIER_1' };
  }

  const versionNumber = renderer.replace(/[\D]/g, '');

  if (verbose) {
    console.log(`Found version number: ${versionNumber}`);
  }

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
      return {
        tier: 'GPU_MOBILE_TIER_0',
        entry: 'BLACKLISTED',
      };
    }

    return {
      tier: 'GPU_DESKTOP_TIER_0',
      entry: 'BLACKLISTED',
    };
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
          // Remove prelude score (`3 - `)
          .split('- ')[1]
          // Entries like 'apple a9x / powervr series 7xt' give problems
          // with the 7 being picked up (resulting in a tier 3 classification of A7 chip which should be tier 1).
          .split(' /')[0];

        const entryVersion = entry.replace(/[\D]/g, '');

        if (
          (entry.includes('adreno') && isRendererAdreno)
          || (entry.includes('apple') && isRendererApple)
          || (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali)
          || (entry.includes('mali-t') && isRendererMaliT)
          || (entry.includes('nvidia') && isRendererNVIDIA)
          || (entry.includes('powervr') && isRendererPowerVR)
        ) {
          if (entryVersion.includes(versionNumber)) {
            if (verbose) {
              console.log(`Match with benchmark entry: ${entry}`);
            }

            mobileTier = `GPU_MOBILE_TIER_${i}`;
            matchedBenchmarkEntry = entry;
          }
        }
      }));

    if (mobileTier === undefined) {
      if (verbose) {
        console.log('Matching GPU tier could not be found, using fallback: GPU_MOBILE_TIER_1');
      }

      mobileTier = 'GPU_MOBILE_TIER_1';
    }

    return {
      tier: mobileTier,
      entry: matchedBenchmarkEntry,
    };
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
      const entryVersion = entry.replace(/[\D]/g, '');

      if (
        (entry.includes('intel') && isRendererIntel)
        || (entry.includes('amd') && isRendererAMD)
        || (entry.includes('nvidia') && isRendererNVIDIA)
      ) {
        if (entryVersion.includes(versionNumber)) {
          if (verbose) {
            console.log(`Match with benchmark entry: ${entry}`);
          }

          desktopTier = `GPU_DESKTOP_TIER_${i}`;
          matchedBenchmarkEntry = entry;
        }
      }
    }));

  if (desktopTier === undefined) {
    if (verbose) {
      console.log('Matching GPU tier could not be found, using fallback: GPU_DESKTOP_TIER_1');
    }

    desktopTier = 'GPU_DESKTOP_TIER_1';
  }

  return {
    tier: desktopTier,
    entry: matchedBenchmarkEntry,
  };
}

export function register(options = {}) {
  this.verbose = false;

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

  // Only used for testing purposes
  this.forceRenderer = '';
  this.forceMobile = false;

  Object.assign(this, options);

  const GPU_TIER = getGPUTier(
    this.verbose,
    this.benchmarkTierPercentagesMobile,
    this.benchmarkTierPercentagesDesktop,
    this.forceRenderer,
    this.forceMobile,
  );

  return {
    tier: GPU_TIER.tier,
    entry: GPU_TIER.entry,
  };
}
