// Application
import * as DetectGPU from '../src/index';

// Test data
import { RENDERER_DESKTOP, RENDERER_MOBILE, RENDERER_TABLET } from './renderers';

// Utilities
const stripPrefix = entries => entries.map(entry => entry.split(' - ')[1].toLowerCase());

const mobile = stripPrefix(RENDERER_MOBILE);
const tablet = stripPrefix(RENDERER_TABLET);
const desktop = stripPrefix(RENDERER_DESKTOP);

function testPerDeviceType(deviceType, forceMobile = false) {
  deviceType.map((rendererEntry) => {
    const GPUTier = DetectGPU.getGPUTier({
      forceRendererString: rendererEntry,
      forceMobile,
    });

    test(`${deviceType} -> GPUTier returns a valid tier`, () => {
      const expected = /GPU_(MOBILE|DESKTOP)_TIER_(0|1|2|3)/;

      expect(GPUTier.tier).toEqual(expect.stringMatching(expected));
    });

    test(`${deviceType} -> GPUTier returns a benchmark entry`, () => {
      if (GPUTier.type === 'BLACKLISTED') {
        console.warn(
          `BLACKLISTED -> Entry: ${rendererEntry}, Tier: ${GPUTier.tier}, Type: ${GPUTier.type}`,
        );
      } else if (GPUTier.tier.match(/GPU_(MOBILE|DESKTOP)_TIER_0/)) {
        console.warn(
          `TIER 0 -> Entry: ${rendererEntry}, Tier: ${GPUTier.tier}, Type: ${GPUTier.type}`,
        );
      } else if (GPUTier.type === 'FALLBACK') {
        console.log(
          `FALLBACK -> Entry: ${rendererEntry}, Tier: ${GPUTier.tier}, Type: ${GPUTier.type}`,
        );
      } else {
        // console.log(`SUCCESS -> Tier: ${GPUTier.tier}, Type: ${GPUTier.type}`);
      }

      expect(GPUTier.type).toBeDefined();
    });
  });
}

testPerDeviceType(mobile, true);
testPerDeviceType(tablet, true);
testPerDeviceType(desktop, false);
