import leven from 'leven';
import fetch from 'unfetch';
import type { TierType, ModelEntry } from './types';
import { getGPUVersion } from './internal/getGPUVersion';
import { getSupportedWebGLContext } from './internal/getSupportedWebGLContext';
import { device } from './internal/device';
import { deobfuscateRenderer } from './internal/deobfuscateRenderer';

const debug = false ? console.log : undefined;

export const getGPUTier = async ({
  mobileTiers = [0, 30, 60],
  desktopTiers = [0, 30, 60],
  renderer,
  mobile = !!device.mobile,
  glContext,
  failIfMajorPerformanceCaveat = true,
  screen = typeof window === 'undefined'
    ? { width: 1920, height: 1080 }
    : window.screen,
  benchmarksUrl = '/benchmarks',
  loadBenchmarks,
}: {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  renderer?: string;
  mobile?: boolean;
  screen?: { width: number; height: number };
  benchmarksUrl?: string;
  loadBenchmarks?: (file: string) => Promise<ModelEntry[] | undefined>;
} = {}) => {
  const toResult = (
    tier: number,
    type: TierType,
    model?: string,
    fps?: number
  ) => ({
    tier,
    mobile,
    type,
    model,
    fps,
  });
  const fallback = toResult(1, 'FALLBACK');
  if (!renderer) {
    const gl =
      glContext ||
      getSupportedWebGLContext(device!.safari12, failIfMajorPerformanceCaveat);
    if (!gl) return toResult(0, 'WEBGL_UNSUPPORTED');
    const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugRendererInfo) {
      renderer = gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL);
    }
    if (!renderer) return fallback;
    renderer = await deobfuscateRenderer(gl, renderer.toLowerCase(), mobile);
  }
  const [fps, model] = await queryBenchmarks(
    benchmarksUrl,
    loadBenchmarks,
    renderer,
    mobile,
    screen
  );
  if (fps === undefined) {
    return fallback;
  } else if (fps === -1) {
    return toResult(0, 'BLACKLISTED');
  }
  const tiers = mobile ? mobileTiers : desktopTiers;
  let tier = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (fps >= tiers[i]) {
      tier = i;
    }
  }
  return toResult(tier, 'BENCHMARK', model, fps);
};

const MODEL_INDEX = 0;

const queryBenchmarks = async (
  benchmarksUrl: string,
  loadBenchmarks = async (file: string): Promise<ModelEntry[] | undefined> => {
    try {
      const data = await fetch(`${benchmarksUrl}/${file}`).then((res) =>
        res.json()
      );
      return data;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  renderer: string,
  mobile: boolean,
  screen: {
    width: number;
    height: number;
  }
): Promise<[number, string] | []> => {
  debug?.('queryBenchmarks', { renderer });
  renderer = renderer
    .toLowerCase()
    // Strip off ANGLE() - for example:
    // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
    .replace(/angle \((.+)\)*$/, '$1')
    // Strip off [number]gb & strip off direct3d and after - for example:
    // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
    // 'Radeon (TM) RX 470 Series'
    .replace(/\s+([0-9]+gb|direct3d.+$)|\(r\)| \([^\)]+\)$/g, '');
  debug?.('queryBenchmarks - renderer cleaned to', { renderer });
  const types = mobile
    ? ['adreno', 'apple', 'mali-t', 'mali', 'nvidia', 'powervr']
    : ['intel', 'amd', 'radeon', 'nvidia', 'geforce'];
  let type: string | undefined;
  for (let i = 0; i < types.length; i++) {
    const typesType = types[i];
    if (renderer.indexOf(typesType) > -1) {
      type = typesType;
      break;
    }
  }
  if (!type) return [];
  debug?.('queryBenchmarks - found type:', { type });
  const benchmarkFile = `${mobile ? 'm' : 'd'}-${type}.json`;
  const benchmarks = await loadBenchmarks(benchmarkFile);
  if (!benchmarks) return [];
  const version = getGPUVersion(renderer);
  let matched: ModelEntry[] = benchmarks.filter(
    ([, modelVersion]) => modelVersion === version
  );
  debug?.(
    `found ${matched.length} matching entries using version '${version}':`,
    matched.map(([model]) => model)
  );
  // If nothing matched, try comparing model names:
  if (!matched.length) {
    matched = benchmarks.filter(([model]) => model.indexOf(renderer) > -1);
    debug?.(`found ${matched.length} matching entries comparing model names`, {
      matched,
    });
  }
  const count = matched.length;
  if (count === 0) return [];
  const [model, , blacklisted, fpsesByScreenSize] =
    count > 1
      ? matched
          .map((match) => [match, leven(renderer, match[MODEL_INDEX])] as const)
          .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
      : matched[0];
  debug?.(
    `${renderer} matched closest to ${model} with the following screen sizes`,
    {
      fpsesByScreenSize,
    }
  );

  let closestFps: number = 0;
  let minDistance = Number.MAX_VALUE;
  let closestScreenSize: [number, number] = [0, 0];
  const screenSize = screen.width * screen.height * window.devicePixelRatio;
  for (let i = 0; i < fpsesByScreenSize.length; i++) {
    let [width, height, fps] = fpsesByScreenSize[i];
    const entryScreenSize = width * height;
    const distance = Math.abs(screenSize - entryScreenSize);
    if (distance < minDistance) {
      minDistance = distance;
      closestFps = fps;
      closestScreenSize = [width, height];
    }
  }
  debug?.(
    blacklisted
      ? `${renderer} was found to be blacklisted`
      : `${renderer} matched closest to ${model} with the following screen sizes`,
    {
      closestFps,
      closestScreenSize,
    }
  );

  return [blacklisted ? -1 : closestFps!, model];
};
