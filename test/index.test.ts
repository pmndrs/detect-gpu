// Data
import { RENDERER_DESKTOP, RENDERER_MOBILE, RENDERER_TABLET } from './data';

// Application
import { ModelEntry } from '../src';
import { expectGPUResults, getTier } from './utils';

const isDebug = !!process.env.DEBUG;

for (const renderers of [RENDERER_MOBILE, RENDERER_TABLET, RENDERER_DESKTOP]) {
  for (const renderer of renderers) {
    test(`${renderer} -> GPUTier returns a valid tier`, async () => {
      const input = {
        isIpad: /apple.+x/i.test(renderer),
        isMobile: renderers !== RENDERER_DESKTOP,
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
        'BENCHMARK_FETCH_FAILED',
      ]).toContain(type);
    });
  }
}

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
for (const { input, expected } of [
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
      gpu: 'nvidia geforce rtx 2080 ti',
    },
    input: {
      isMobile: false,
      renderer: 'GeForce RTX 2080 Ti/PCIe/SSE2',
    },
  },
  {
    expected: {
      gpu: 'nvidia geforce rtx 2080 ti',
    },
    input: {
      isMobile: false,
      renderer: 'ANGLE (NVIDIA GeForce RTX 2080 Ti Direct3D11 vs_5_0 ps_5_0)',
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
      gpu: 'apple a18 gpu',
    },
    input: {
      isMobile: true,
      renderer: 'Apple a18 GPU',
    },
  },
  {
    expected: {
      gpu: 'apple a18 pro gpu',
    },
    input: {
      isMobile: true,
      renderer: 'Apple a18 pro GPU',
    },
  },
  {
    expected: {
      gpu: 'apple m3',
    },
    input: {
      isMobile: false,
      renderer: 'Apple M3',
    },
  },
  {
    expected: {
      gpu: 'apple m4',
    },
    input: {
      isMobile: false,
      renderer: 'Apple M4',
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
      gpu: 'nvidia geforce gtx 750',
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
  {
    expected: {
      gpu: 'samsung xclipse 920',
    },
    input: {
      isMobile: true,
      renderer: 'ANGLE (Samsung Xclipse 920) on Vulkan 1.1.179',
    },
  },
  {
    expected: {
      gpu: 'nvidia geforce gtx 970',
    },
    input: {
      isMobile: false,
      renderer:
        'ANGLE (NVIDIA, Vulkan 1.2.175 (NVIDIA NVIDIA GeForce GTX 970 (0x000013C2)), NVIDIA)',
    },
  },
  {
    expected: {
      gpu: 'amd renoir',
    },
    input: {
      isMobile: false,
      renderer: 'amd, amd renoir (llvm 14.0.6), opengl 4.6)',
    },
  },
]) {
  test(`${input.renderer} should find ${expected.gpu}`, async () => {
    expectGPUResults(
      {
        type: 'BENCHMARK',
        ...expected,
      },
      await getTier(input)
    );
  });
}

// expect FALLBACK results:
[
  {
    isMobile: true,
    renderer: 'this renderer does not exist',
  },
  {
    isMobile: false,
    renderer: 'this renderer does not exist',
  },
].map((settings) => {
  test(`${settings.renderer} should return FALLBACK`, async () => {
    expectGPUResults(
      {
        gpu: undefined,
        isMobile: settings.isMobile,
        type: 'FALLBACK',
      },
      await getTier(settings)
    );
  });
});

test('SwiftShader is detected as BLOCKLISTED tier 0', async () => {
  // SwiftShader is Chrome's CPU-based WebGL fallback — no hardware
  // acceleration, so consumers should treat it as unusable.
  const result = await getTier({
    isMobile: false,
    renderer:
      'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
  });
  expect(result.type).toBe('BLOCKLISTED');
  expect(result.tier).toBe(0);
  expect(result.gpu).toBe('swiftshader');
});

test('Apple Silicon desktop Safari — tier-3 BENCHMARK with m-series label', async () => {
  // Safari returns 'Apple GPU' uniformly for M1–M5 with no chip-level
  // discrimination available from WebGL. Base M1 already hits the tier-3
  // fps floor, so the result is a true lower bound for the whole family.
  const result = await getTier({
    isMobile: false,
    renderer: 'Apple GPU',
  });
  expectGPUResults(
    { type: 'BENCHMARK', tier: 3, gpu: 'apple m-series', isMobile: false },
    result
  );
  expect(result.fps).toBe(60);
  expect(result.device).toBeUndefined();
});

test('benchmark fetch failure surfaces as BENCHMARK_FETCH_FAILED, not silent FALLBACK', async () => {
  // Silent degradation to tier-1 FALLBACK misrepresents fast hardware as
  // slow whenever the benchmark CDN is blocked (CSP, CORS, unpkg outage).
  // Consumers need a way to detect the condition so they can retry.
  const result = await getTier({
    isMobile: false,
    renderer:
      'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Laptop GPU (0x00002520) Direct3D11 vs_5_0 ps_5_0, D3D11)',
    loadBenchmarks: async () => {
      throw new Error('simulated network failure');
    },
  });
  expect(result.type).toBe('BENCHMARK_FETCH_FAILED');
  expect(result.tier).toBe(1);
});

test('Apple GPU on mobile does NOT take the desktop tier-3 path', async () => {
  // iPhone/iPad route through deobfuscateAppleGPU and resolve to specific
  // chip benchmarks. The desktop tier-3 fallback must not fire on mobile,
  // even with the same masked renderer string.
  const result = await getTier({
    isMobile: true,
    renderer: 'Apple GPU',
  });
  expect(result.tier).not.toBe(3);
  expect(result.gpu).not.toBe('apple gpu');
});

// expect BLOCKLISTED results:
[
  {
    input: {
      isMobile: false,
      renderer: 'ANGLE (ATI Radeon HD 5670 Direct3D11 vs_5_0 ps_5_0)',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'AMD Radeon HD 6970M OpenGL Engine',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'ANGLE (NVIDIA Quadro FX 1500 Direct3D9Ex vs_3_0 ps_3_0)',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'Intel(R) G45/G43 Express Chipset',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'PowerVR SGX 543',
    },
  },
  {
    expected: {
      gpu: 'swiftshader',
    },
    input: {
      isMobile: false,
      renderer: 'Google SwiftShader',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'Intel GMA X3100 OpenGL Engine',
    },
  },
  {
    input: {
      isMobile: false,
      renderer: 'NVIDIA GeForce GT 120 OpenGL Engine',
    },
  },
].map(({ expected = {}, input }) => {
  test(`${input.renderer} should return BLOCKLISTED`, async () => {
    expectGPUResults(
      {
        ...expected,
        tier: 0,
        type: 'BLOCKLISTED',
      },
      await getTier(input)
    );
  });
});

test(`When queryBenchmarks throws, BENCHMARK_FETCH_FAILED is returned`, async () => {
  expectGPUResults(
    {
      tier: 1,
      type: 'BENCHMARK_FETCH_FAILED',
    },
    await getTier({
      loadBenchmarks: async (): Promise<ModelEntry[]> => {
        throw new Error();
      },
      renderer: bottomTierDesktop,
    })
  );
});
