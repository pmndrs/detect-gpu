// Data
import { RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP } from './data';

// Application
import { getGPUTier } from '../src/index';
import { TModelEntry, TTierResult } from '../src/types';

const isDebug = false;

const getTier = ({
  isMobile,
  renderer,
  isIpad,
}: {
  isMobile?: boolean;
  renderer?: string;
  isIpad?: boolean;
}): Promise<TTierResult> =>
  getGPUTier({
    desktopTiers: [0, 15, 30, 60],
    mobileTiers: [0, 15, 30, 60],
    override: {
      isIpad,
      isMobile,
      loadBenchmarks: async (
        file: string
      ): Promise<TModelEntry[] | undefined> =>
        (await import(`../benchmarks/${file}`)).default,
      renderer,
    },
  });

[RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP].forEach(
  (renderers: string[]): void => {
    testRenders(renderers, renderers !== RENDERER_DESKTOP);
  }
);

const topTierDesktop =
  'ANGLE (NVIDIA GeForce RTX 2080 Ti Direct3D11 vs_5_0 ps_5_0)';
test(`Top tier desktop: ${topTierDesktop}`, async (): Promise<void> => {
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

test(`Bottom tier desktop: ${bottomTierDesktop}`, async (): Promise<void> => {
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
].map(({ input, expected }): void => {
  test(`${input.renderer} should find ${expected.gpu}`, async (): Promise<
    void
  > => {
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
([['this renderer does not exist', true]] as [string, boolean][]).map(
  ([renderer, isMobile]: [renderer: string, isMobile: boolean]): void => {
    test(`${renderer} should return FALLBACK`, async (): Promise<void> => {
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

// expect BLACKLISTED results:
([['ANGLE (ATI Radeon HD 5670 Direct3D11 vs_5_0 ps_5_0)', false]] as [
  string,
  boolean
][]).map(
  ([renderer, isMobile]: [renderer: string, isMobile: boolean]): void => {
    test(`${renderer} should return BLACKLISTED`, async (): Promise<void> => {
      expectGPUResults(
        {
          isMobile,
          type: 'BLACKLISTED',
        },
        await getTier({
          isMobile,
          renderer,
        })
      );
    });
  }
);

const expectGPUResults = (
  expected: Partial<TTierResult>,
  result: TTierResult
): void => {
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

function testRenders(deviceType: string[], mobileDevice = false): void {
  deviceType.forEach(
    async (renderer: string): Promise<void> => {
      test(`${renderer} -> GPUTier returns a valid tier`, async (): Promise<
        void
      > => {
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
          'BLACKLISTED',
          'FALLBACK',
          'BENCHMARK',
        ]).toContain(type);
      });
    }
  );
}
