// Data
import { RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP } from './data';

// Application
import { getGPUTier } from '../src/index';
import { ModelEntry, TierResult } from '../src/types';

const isDebug = false;

const getTier = ({
  isMobile,
  renderer,
  isIpad,
}: {
  isMobile?: boolean;
  renderer?: string;
  isIpad?: boolean;
}) =>
  getGPUTier({
    desktopTiers: [0, 15, 30, 60],
    mobileTiers: [0, 15, 30, 60],
    override: {
      isIpad,
      isMobile,
      loadBenchmarks: async (file: string): Promise<ModelEntry[] | undefined> =>
        (await import(`../benchmarks/${file}`)).default,
      renderer,
    },
  });

[RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP].forEach(
  (renderers: string[]) => {
    testRenders(renderers, renderers !== RENDERER_DESKTOP);
  }
);

const topTierDesktop =
  'ANGLE (NVIDIA GeForce RTX 2080 Ti Direct3D11 vs_5_0 ps_5_0)';
test(`Top tier desktop: ${topTierDesktop}`, async () => {
  expectGPUResults(
    {
      isMobile: false,
      tier: 3,
      type: 'BENCHMARK',
    },
    await getTier({
      isMobile: false,
      renderer: topTierDesktop,
    })
  );
});

const bottomTierDesktop =
  'ANGLE (AMD Radeon(TM) HD 8280E Direct3D11 vs_5_0 ps_5_0)';

test(`Bottom tier desktop: ${bottomTierDesktop}`, async () => {
  expectGPUResults(
    {
      isMobile: false,
      tier: 0,
      type: 'BENCHMARK',
    },
    await getTier({
      isMobile: false,
      renderer: bottomTierDesktop,
    })
  );
});

// expect BENCHMARK results:
[
  {
    expected: {
      gpu: 'intel uhd graphics 620',
    },
    input: {
      isMobile: false,
      renderer: 'Intel UHD Graphics 620',
    },
  },
  {
    expected: {
      gpu: 'amd radeon rx vega m gh',
    },
    input: {
      isMobile: false,
      renderer: 'ANGLE (Radeon RX Vega M GH Graphics Direct3D11 vs_5_0 ps_5_0)',
    },
  },
  {
    expected: {
      device: 'apple ipad pro (11-inch)',
      gpu: 'apple a12x gpu',
    },
    input: {
      isIpad: true,
      isMobile: true,
      renderer: 'Apple A12X GPU',
      screen: {
        height: 1668,
        width: 2224,
      },
    },
  },
  {
    expected: {
      gpu: 'apple a12x gpu',
    },
    input: {
      isIpad: true,
      isMobile: true,
      renderer: 'Apple A12X GPU',
    },
  },
  {
    expected: {
      gpu: 'apple a9x gpu',
    },
    input: {
      isIpad: true,
      isMobile: true,
      renderer: 'Apple a9x GPU',
    },
  },
  {
    expected: {
      gpu: 'apple a10 gpu',
    },
    input: {
      isMobile: true,
      renderer: 'Apple a10 GPU',
    },
  },
  {
    expected: {
      gpu: 'intel mesa dri intel uhd graphics 630',
    },
    input: {
      isMobile: false,
      renderer: 'Mesa DRI Intel(R) UHD Graphics 630 (Coffeelake 3x8 GT2)',
    },
  },
  {
    expected: {
      gpu: 'nvidia geforce gtx 750 ti',
    },
    input: {
      isMobile: false,
      renderer: 'GeForce GTX 750/PCIe/SSE2',
    },
  },
  {
    expected: {
      gpu: 'nvidia geforce gtx 1060',
    },
    input: {
      isMobile: false,
      renderer: 'GeForce GTX 1060',
    },
  },
  {
    expected: {
      gpu: 'radeon rx 470',
    },
    input: {
      isMobile: false,
      renderer: 'ANGLE (Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0)',
    },
  },
  {
    expected: {
      gpu: 'amd radeon hd 6470m',
    },
    input: {
      isMobile: false,
      renderer: 'ANGLE (Radeon (TM) HD 6470M Direct3D9Ex vs_3_0 ps_3_0)',
    },
  },
  {
    expected: {
      gpu: 'nvidia geforce gtx 1060',
    },
    input: {
      isMobile: false,
      renderer: 'ANGLE (NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0)',
    },
  },
  {
    expected: {
      gpu: 'nvidia tegra',
    },
    input: {
      isMobile: true,
      renderer: 'NVIDIA Tegra',
    },
  },
  {
    expected: {
      gpu: 'arm mali-g51',
    },
    input: {
      isMobile: true,
      renderer: 'Mali-G51',
    },
  },
].map(({ input, expected }) => {
  test(`${input.renderer} should find ${expected.gpu}`, async () => {
    expectGPUResults(
      {
        type: 'BENCHMARK',
        ...expected,
      },
      await getTier(input)
    );
  });
});

// expect FALLBACK results:
[['this renderer does not exist', true] as const].map(
  ([renderer, isMobile]) => {
    test(`${renderer} should return FALLBACK`, async () => {
      expectGPUResults(
        {
          gpu: undefined,
          isMobile,
          type: 'FALLBACK',
        },
        await getTier({
          isMobile,
          renderer,
        })
      );
    });
  }
);

// expect BLOCKLISTED results:
[
  {
    input: {
      renderer: 'ANGLE (ATI Radeon HD 5670 Direct3D11 vs_5_0 ps_5_0)',
    },
  },
  {
    input: {
      renderer: 'AMD Radeon HD 6970M OpenGL Engine',
    },
  },
  {
    input: {
      renderer: 'ANGLE (NVIDIA Quadro FX 1500 Direct3D9Ex vs_3_0 ps_3_0)',
    },
  },
  {
    input: {
      renderer: 'Intel(R) G45/G43 Express Chipset',
    },
  },
  {
    input: {
      renderer: 'PowerVR SGX 543',
    },
  },
  {
    input: {
      renderer: 'Google SwiftShader',
    },
  },
  {
    input: {
      renderer: 'Intel GMA X3100 OpenGL Engine',
    },
  },
  {
    input: {
      renderer: 'NVIDIA GeForce GT 120 OpenGL Engine',
    },
  },
].map(({ input }) => {
  test(`${input.renderer} should return BLOCKLISTED`, async () => {
    expectGPUResults(
      {
        tier: 0,
        type: 'BLOCKLISTED',
      },
      await getTier(input)
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

  if (expected.isMobile !== undefined) {
    expect(result.isMobile).toBe(expected.isMobile);
  }

  if (expected.gpu !== undefined) {
    expect(result.gpu).toBe(expected.gpu);
  }
};

function testRenders(deviceType: string[], mobileDevice = false) {
  deviceType.forEach(async (renderer: string) => {
    test(`${renderer} -> GPUTier returns a valid tier`, async () => {
      const input = {
        isIpad: /apple.+x/i.test(renderer),
        isMobile: mobileDevice,
        renderer,
      };

      const result = await getTier(input);
      const jsonResult = JSON.stringify(result, null, 2);
      const { type, tier } = result;

      if (isDebug) {
        console.log(
          `${tier === 0 ? `TIER 0` : type} -> Input: ${JSON.stringify(
            input,
            null,
            2
          )} - Output: ${jsonResult}`
        );
      }

      expect([0, 1, 2, 3]).toContain(tier);

      expect([
        'WEBGL_UNSUPPORTED',
        'BLOCKLISTED',
        'FALLBACK',
        'BENCHMARK',
      ]).toContain(type);
    });
  });
}
