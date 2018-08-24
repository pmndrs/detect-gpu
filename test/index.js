// Application
import * as DetectGPU from '../src/index';

// Test data
import { RENDERER_DESKTOP, RENDERER_MOBILE, RENDERER_TABLET } from './renderers';

// Utilities
const stripPrefix = entries => entries.map(entry => entry.split(' - ')[1].toLowerCase());

const mobile = stripPrefix(RENDERER_MOBILE);
const tablet = stripPrefix(RENDERER_TABLET);
const desktop = stripPrefix(RENDERER_DESKTOP);

function testPerDeviceType(type, forceMobile = false) {
  type.map((entry) => {
    const GPUTier = DetectGPU.register({
      verbose: false,
      benchmarkTierPercentagesMobile: [15, 35, 30, 20],
      benchmarkTierPercentagesDesktop: [15, 35, 30, 20],
      forceRenderer: entry,
      forceMobile,
    });

    test(`${type} -> GPUTier returns a valid tier`, () => {
      const expected = /GPU_(MOBILE|DESKTOP)_TIER_(0|1|2|3)/;

      expect(GPUTier.tier).toEqual(expect.stringMatching(expected));
    });

    test(`${type} -> GPUTier returns a benchmark entry`, () => {
      if (GPUTier.entry === 'BLACKLISTED') {
        console.log(`BLACKLISTED -> Tier: ${GPUTier.tier}, Entry: ${entry}`);
      }

      expect(GPUTier.entry).toBeDefined();
    });
  });
}

testPerDeviceType(mobile, true);
testPerDeviceType(tablet, true);
testPerDeviceType(desktop, false);
