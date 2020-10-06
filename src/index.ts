import leven from 'leven';
import fetch from 'unfetch';
import type { TierType, ModelEntry } from './types';
import { getGPUVersion } from './internal/getGPUVersion';
import { getSupportedWebGLContext } from './internal/getSupportedWebGLContext';
import { deviceInfo } from './internal/device';
import { deobfuscateRenderer } from './internal/deobfuscateRenderer';

const debug = false ? console.log : undefined;
const queryCache: { [k: string]: Promise<ModelEntry[] | undefined> } = {};

export const getGPUTier = async ({
  mobileTiers = [0, 30, 60],
  desktopTiers = [0, 30, 60],
  override: {
    renderer,
    isIpad = !!deviceInfo.isIpad,
    isMobile = !!deviceInfo.isMobile,
    screen = typeof window === 'undefined'
      ? { width: 1920, height: 1080 }
      : window.screen,
    loadBenchmarks,
  } = {},
  glContext,
  failIfMajorPerformanceCaveat = true,
  benchmarksUrl = '/benchmarks',
}: {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  override?: {
    renderer?: string;
    isIpad?: boolean;
    isMobile?: boolean;
    screen?: { width: number; height: number };
    loadBenchmarks?: (file: string) => Promise<ModelEntry[] | undefined>;
  };
  benchmarksUrl?: string;
} = {}) => {
  const MODEL_INDEX = 0;
  const queryBenchmarks = async (
    benchmarksUrl: string,
    loadBenchmarks = async (
      file: string
    ): Promise<ModelEntry[] | undefined> => {
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
    renderer: string
  ): Promise<[number, number, string, string | undefined] | []> => {
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
    const types = isMobile
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
    const benchmarkFile = `${isMobile ? 'm' : 'd'}-${type}.json`;
    let benchmarkP: Promise<ModelEntry[] | undefined> = (queryCache[
      benchmarkFile
    ] = queryCache[benchmarkFile] || loadBenchmarks(benchmarkFile));
    const benchmarks = await benchmarkP;
    if (!benchmarks) return [];
    const version = getGPUVersion(renderer);
    const isApple = type === 'apple';
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
      debug?.(
        `found ${matched.length} matching entries comparing model names`,
        {
          matched,
        }
      );
    }
    const count = matched.length;
    if (count === 0) return [];
    let [gpu, , blacklisted, fpsesByScreenSize] =
      count > 1
        ? matched
            .map(
              (match) => [match, leven(renderer, match[MODEL_INDEX])] as const
            )
            .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
        : matched[0];
    debug?.(
      `${renderer} matched closest to ${gpu} with the following screen sizes`,
      JSON.stringify(fpsesByScreenSize)
    );

    let minDistance = Number.MAX_VALUE;
    let closest: [number, number, number, string];
    const { devicePixelRatio } = window;
    const screenSize =
      screen.width * devicePixelRatio * (screen.height * devicePixelRatio);
    if (isApple) {
      fpsesByScreenSize = fpsesByScreenSize.filter(
        ([, , , device]) => device.indexOf(isIpad ? 'ipad' : 'iphone') > -1
      );
    }
    for (let i = 0; i < fpsesByScreenSize.length; i++) {
      const match = fpsesByScreenSize[i];
      let [width, height] = match;
      const entryScreenSize = width * height;
      const distance = Math.abs(screenSize - entryScreenSize);
      if (distance < minDistance) {
        minDistance = distance;
        closest = match;
      }
    }
    // If blacklisted change fps to -1
    // TODO: move this to update benchmarks script
    const [, , fps, device] = closest!;
    return [minDistance, blacklisted ? -1 : fps, gpu, device];
  };

  const toResult = (
    tier: number,
    type: TierType,
    fps?: number,
    gpu?: string,
    device?: string
  ) => ({
    tier,
    isMobile,
    type,
    fps,
    gpu,
    device,
  });
  let renderers: string[];
  const fallback = toResult(1, 'FALLBACK');
  if (!renderer) {
    const gl =
      glContext ||
      getSupportedWebGLContext(
        deviceInfo!.isSafari12,
        failIfMajorPerformanceCaveat
      );
    if (!gl) return toResult(0, 'WEBGL_UNSUPPORTED');
    const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugRendererInfo) {
      renderer = gl
        .getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL)
        .toLowerCase();
    }
    if (!renderer) return fallback;
    renderers = deobfuscateRenderer(gl, renderer, isMobile);
  } else {
    renderers = [renderer];
  }
  const results = await Promise.all(
    renderers.map((renderer) =>
      queryBenchmarks(benchmarksUrl, loadBenchmarks, renderer)
    )
  );
  const result =
    results.length === 1
      ? results[0]
      : results.sort(
          ([aDis = Number.MAX_VALUE], [bDis = Number.MAX_VALUE]) => aDis - bDis
        )[0];
  if (result.length === 0) return fallback;
  const [, fps, model, device] = result;
  if (fps === -1) return toResult(0, 'BLACKLISTED', fps, model, device);

  const tiers = isMobile ? mobileTiers : desktopTiers;
  let tier = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (fps >= tiers[i]) {
      tier = i;
    }
  }
  return toResult(tier, 'BENCHMARK', fps, model, device);
};
