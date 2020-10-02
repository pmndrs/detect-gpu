import { getGPUTier } from '../src/index';
import { TierResult } from '../src/types';

import { RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP } from './data';

const isDebug = false;

const getTier = ({ mobile, renderer }: { mobile: boolean; renderer: string }) =>
  getGPUTier({
    mobile,
    renderer,
    mobilePercentiles: [10, 40, 30, 20],
    desktopPercentiles: [10, 40, 30, 20],
  });

[RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP].forEach((renderers) => {
  testRenders(renderers, renderers !== RENDERER_DESKTOP);
});

const topTierDesktop = 'ANGLE (NVIDIA GeForce RTX 2080 Ti Direct3D11 vs_5_0 ps_5_0)';

test(`Top tier desktop: ${topTierDesktop}`, async () => {
  expectGPUResults(
    {
      type: 'BENCHMARK',
      tier: 3,
      mobile: false,
    },
    await getTier({
      mobile: false,
      renderer: topTierDesktop,
    })
  );
});

const bottomTierDesktop = 'ANGLE (AMD Radeon HD 6290M Direct3D11 vs_5_0 ps_5_0)';

test(`Bottom tier desktop: ${bottomTierDesktop}`, async () => {
  expectGPUResults(
    {
      type: 'BENCHMARK',
      tier: 0,
      mobile: false,
    },
    await getTier({
      mobile: false,
      renderer: bottomTierDesktop,
    })
  );
});

// expect BENCHMARK results:
(<[string, boolean, string][]>[
  ['Intel UHD Graphics 620', false, 'intel uhd graphics 620'],
  [
    'ANGLE (Radeon RX Vega M GH Graphics Direct3D11 vs_5_0 ps_5_0)',
    false,
    'amd radeon rx vega m gh',
  ],
  ['Apple A12X GPU', true, 'apple a12x gpu'],
  ['Apple A12 GPU', true, 'apple a12 gpu'],
  ['apple a9x gpu', true, 'apple a9x gpu'],
  ['Apple A10 GPU', true, 'apple a10 gpu'],
  [
    'Mesa DRI Intel(R) UHD Graphics 630 (Coffeelake 3x8 GT2)',
    false,
    'intel mesa dri intel uhd graphics 630',
  ],
  ['GeForce GTX 750/PCIe/SSE2', false, 'nvidia geforce gtx 750 ti'],
  ['GeForce GTX 1060', false, 'nvidia geforce gtx 1060'],
  [
    'ANGLE (Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0)',
    false,
    'amd radeon rx 470/480',
  ],
  [
    'ANGLE (Radeon (TM) HD 6470M Direct3D9Ex vs_3_0 ps_3_0)',
    false,
    'amd radeon hd 6470m',
  ],
  [
    'ANGLE (NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0)',
    false,
    'nvidia geforce gtx 1060',
  ],
  ['NVIDIA Tegra', true, 'nvidia tegra'],
  ['Mali-G51', true, 'arm mali-g51'],
]).map(([renderer, mobile, model]) => {
  test(`${renderer} should find ${model}`, async () => {
    expectGPUResults(
      {
        type: 'BENCHMARK',
        model,
        mobile,
      },
      await getTier({
        mobile,
        renderer,
      })
    );
  });
});

// expect FALLBACK results:
(<[string, boolean][]>[
  ['this renderer does not exist', true],
]).map(([renderer, mobile]) => {
  test(`${renderer} should return FALLBACK`, async () => {
    expectGPUResults(
      {
        type: 'FALLBACK',
        mobile,
        model: undefined,
      },
      await getTier({
        mobile,
        renderer,
      })
    );
  });
});

// expect BLACKLISTED results:
(<[string, boolean][]>[
  ['ANGLE (ATI Radeon HD 5670 Direct3D11 vs_5_0 ps_5_0)', false],
]).map(([renderer, mobile]) => {
  test(`${renderer} should return BLACKLISTED`, async () => {
    expectGPUResults(
      {
        type: 'BLACKLISTED',
        mobile,
      },
      await getTier({
        mobile,
        renderer,
      })
    );
  });
});

const expectGPUResults = (
  expected: Partial<TierResult>,
  result: TierResult
) => {
  if (expected.type) {
    expect(result.type).toBe(expected.type);
  }
  
  if (expected.tier !== undefined) {
    expect(result.tier).toBe(expected.tier);
  }
  
  if (expected.mobile !== undefined) {
    expect(result.mobile).toBe(expected.mobile);
  }
  
  if (expected.model !== undefined) {
    expect(result.model).toBe(expected.model);
  }
};

function testRenders(deviceType: string[], mobileDevice = false) {
  deviceType.forEach(async (renderer) => {
    test(`${renderer} -> GPUTier returns a valid tier`, async () => {
      const { tier, mobile, type, model } = await getTier({
        mobile: mobileDevice,
        renderer,
      });
      
      if (isDebug) {
        if (type === 'WEBGL_UNSUPPORTED') {
          console.log(
            `WEBGL_UNSUPPORTED -> Entry: ${renderer}, Mobile: ${mobile}, Tier: ${tier}, Type: ${type}`
          );
        } else if (type === 'BLACKLISTED') {
          console.log(
            `BLACKLISTED -> Entry: ${renderer}, Mobile: ${mobile}, Tier: ${tier}, Type: ${type}`
          );
        } else if (tier === 0) {
          console.log(
            `TIER 0 -> Entry: ${renderer}, Mobile: ${mobile}, Tier: ${tier}, Type: ${type}`
          );
        } else if (type === 'FALLBACK') {
          console.log(
            `FALLBACK -> Entry: ${renderer}, Mobile: ${mobile}, Tier: ${tier}, Type: ${type}`
          );
        } else {
          console.log(
            `SUCCESS -> Entry: ${renderer}, Found: ${model}, Tier: ${tier}, Mobile: ${mobile}, Type: ${type}`
          );
        }
      }

      expect([0, 1, 2, 3]).toContain(tier);

      expect([
        'WEBGL_UNSUPPORTED',
        'BLACKLISTED',
        'FALLBACK',
        'BENCHMARK',
      ]).toContain(type);
    });
  });
}
