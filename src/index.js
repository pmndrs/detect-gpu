// Data
import { BENCHMARK_SCORE_DESKTOP, BENCHMARK_SCORE_MOBILE } from './benchmark';

// Device
import Device from './device';

// Utilities
import { getWebGLContext, getBenchmarkByPercentage } from './utilities';

// console.log(BENCHMARK_SCORE_DESKTOP);
// console.log(BENCHMARK_SCORE_MOBILE);

// Device detection
const device = new Device();

export function getGPUTier(options = {}) {
  this.mobileBenchmarkPercentages = [15, 35, 30, 20];
  this.desktopBenchmarkPercentages = [15, 35, 30, 20];
  this.forceRendererString = false;
  this.forceMobile = false;

  Object.assign(this, options);

  const isMobile = device.mobile || device.tablet || this.forceMobile;
  const isDesktop = !isMobile;

  let renderer;

  if (this.forceRendererString === false) {
    const gl = getWebGLContext({
      failIfMajorPerformanceCaveat: true,
    });

    const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

    renderer = glExtensionDebugRendererInfo
      && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
  } else {
    renderer = this.forceRendererString;
  }

  // GPU BLACKLIST
  // - https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
  // - https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
  // - https://chromium.googlesource.com/chromium/src/gpu/+/master/config/software_rendering_list.json
  const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|radeon r9 200|mali-4|mali-3|mali-2)/.test(
    renderer,
  );

  if (isGPUBlacklisted) {
    if (isMobile) {
      // Return GPU_MOBILE_TIER_0 and mark as blacklisted
    } else {
      // Return GPU_DESKTOP_TIER_0 and mark as blacklisted
    }
  }

  if (isMobile) {
    const mobileBenchmark = getBenchmarkByPercentage(
      BENCHMARK_SCORE_MOBILE,
      this.mobileBenchmarkPercentages,
    );

    console.log(mobileBenchmark);
  }

  if (isDesktop) {
    const desktopBenchmark = getBenchmarkByPercentage(
      BENCHMARK_SCORE_DESKTOP,
      this.desktopBenchmarkPercentages,
    );

    console.log(desktopBenchmark);
  }
}
