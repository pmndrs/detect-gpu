// Data
import { RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP } from './data';

// Application
import { getGPUTier } from '../src/index';
import { TModelEntry, TTierType, TTierResult } from '../src/types';

const isDebug = false;

const getTier = ({
  isMobile,
  renderer,
  isIpad,
}: {
  isMobile?: boolean;
  renderer?: string;
  isIpad?: boolean;
}): any =>
  getGPUTier({
    override: {
      isMobile,
      isIpad,
      renderer,
      loadBenchmarks: async (
        file: string
      ): Promise<TModelEntry[] | undefined> =>
        (await import(`../benchmarks/${file}`)).default,
    },
    mobileTiers: [10, 30, 60],
    desktopTiers: [10, 30, 60],
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
      type: 'BENCHMARK',
      tier: 2,
      isMobile: false,
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
      type: 'BENCHMARK',
      tier: 0,
      isMobile: false,
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
    input: {
      renderer: 'Intel UHD Graphics 620',
      isMobile: false,
    },
    expected: {
      gpu: 'intel uhd graphics 620',
    },
  },
  {
    input: {
      renderer: 'ANGLE (Radeon RX Vega M GH Graphics Direct3D11 vs_5_0 ps_5_0)',
      isMobile: false,
    },
    expected: {
      gpu: 'amd radeon rx vega m gh',
    },
  },
  {
    input: {
      renderer: 'Apple A12X GPU',
      isMobile: true,
      isIpad: true,
      screen: {
        width: 2224,
        height: 1668,
      },
    },
    expected: {
      gpu: 'apple a12x gpu',
      device: 'apple ipad pro (11-inch)',
    },
  },
  {
    input: {
      renderer: 'Apple A12X GPU',
      isMobile: true,
      isIpad: true,
    },
    expected: {
      gpu: 'apple a12x gpu',
    },
  },
  {
    input: {
      renderer: 'Apple a9x GPU',
      isMobile: true,
      isIpad: true,
    },
    expected: {
      gpu: 'apple a9x gpu',
    },
  },
  {
    input: {
      renderer: 'Apple a10 GPU',
      isMobile: true,
    },
    expected: {
      gpu: 'apple a10 gpu',
    },
  },
  {
    input: {
      renderer: 'Mesa DRI Intel(R) UHD Graphics 630 (Coffeelake 3x8 GT2)',
      isMobile: false,
    },
    expected: {
      gpu: 'intel mesa dri intel uhd graphics 630',
    },
  },
  {
    input: {
      renderer: 'GeForce GTX 750/PCIe/SSE2',
      isMobile: false,
    },
    expected: {
      gpu: 'nvidia geforce gtx 750 ti',
    },
  },
  {
    input: {
      renderer: 'GeForce GTX 1060',
      isMobile: false,
    },
    expected: {
      gpu: 'nvidia geforce gtx 1060',
    },
  },
  {
    input: {
      renderer: 'ANGLE (Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0)',
      isMobile: false,
    },
    expected: {
      gpu: 'radeon rx 470',
    },
  },
  {
    input: {
      renderer: 'ANGLE (Radeon (TM) HD 6470M Direct3D9Ex vs_3_0 ps_3_0)',
      isMobile: false,
    },
    expected: {
      gpu: 'amd radeon hd 6470m',
    },
  },
  {
    input: {
      renderer: 'ANGLE (NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0)',
      isMobile: false,
    },
    expected: {
      gpu: 'nvidia geforce gtx 1060',
    },
  },
  {
    input: {
      renderer: 'NVIDIA Tegra',
      isMobile: true,
    },
    expected: {
      gpu: 'nvidia tegra',
    },
  },
  {
    input: {
      renderer: 'Mali-G51',
      isMobile: true,
    },
    expected: {
      gpu: 'arm mali-g51',
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
          type: 'FALLBACK',
          isMobile,
          gpu: undefined,
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
          type: 'BLACKLISTED',
          isMobile,
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
          isMobile: mobileDevice,
          isIpad: /apple.+x/i.test(renderer),
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
