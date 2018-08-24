// Application
import * as DetectGPU from '../src/index';

// Test data
import { RENDERER_DESKTOP, RENDERER_MOBILE, RENDERER_TABLET } from './renderers';

// Utilities
const stripPrefix = entries => entries.map(entry => entry.split(' - ')[1].toLowerCase());

const desktop = stripPrefix(RENDERER_DESKTOP);
const mobile = stripPrefix(RENDERER_MOBILE);
const tablet = stripPrefix(RENDERER_TABLET);

const GPUTier = DetectGPU.register({
  verbose: false,
  benchmarkTierPercentagesMobile: [15, 35, 30, 20],
  benchmarkTierPercentagesDesktop: [15, 35, 30, 20],
  forceRenderer: 'intel(r) iris(tm) plus graphics 640'.toLowerCase(),
});

test('GPUTier returns a valid tier', () => {
  const expected = /GPU_(MOBILE|DESKTOP)_TIER_(0|1|2|3)/;

  expect(GPUTier).toEqual(expect.stringMatching(expected));
});
