// Application
import * as DetectGPU from '../src/index';

// Test data
import { RENDERER_DESKTOP, RENDERER_MOBILE, RENDERER_TABLET } from './renderers';

const stripPrefix = entries => entries.map(entry => entry.split(' - ')[1].toLowerCase());

export default () => {
  const desktop = stripPrefix(RENDERER_DESKTOP);
  const mobile = stripPrefix(RENDERER_MOBILE);
  const tablet = stripPrefix(RENDERER_TABLET);

  console.log(desktop, mobile, tablet);
};

const GPUTier = DetectGPU.register({
  verbose: true,
  benchmarkTierPercentagesMobile: [15, 35, 30, 20],
  benchmarkTierPercentagesDesktop: [15, 35, 30, 20],
  forceRenderer: 'Intel(R) HD Graphics 6000',
});

console.log(GPUTier);
