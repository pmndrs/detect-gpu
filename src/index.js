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
