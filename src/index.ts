// Vendor
import leven from 'leven';
// @ts-ignore unfetch doesn't properly export its types
import fetch from 'unfetch';

// Internal
import { getGPUVersion } from './internal/getGPUVersion';
import { getSupportedWebGLContext } from './internal/getSupportedWebGLContext';
import { deviceInfo, isSSR } from './internal/deviceInfo';
import { deobfuscateRenderer } from './internal/deobfuscateRenderer';

// Types
import type { ModelEntry, TierResult, TierType } from './types';

const queryCache: { [k: string]: Promise<ModelEntry[] | undefined> } = {};

export const getGPUTier = async ({
  mobileTiers = [0, 30, 60],
  desktopTiers = [0, 30, 60],
  debug = false,
  override: {
    renderer,
    isIpad = Boolean(deviceInfo?.isIpad),
    isMobile = Boolean(deviceInfo?.isMobile),
    screen = isSSR ? { width: 1920, height: 1080 } : window.screen,
    loadBenchmarks,
  } = {},
  glContext,
  failIfMajorPerformanceCaveat = true,
  benchmarksURL = '/benchmarks',
}: {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  debug?: boolean;
  override?: {
    renderer?: string;
    isIpad?: boolean;
    isMobile?: boolean;
    screen?: { width: number; height: number };
    loadBenchmarks?: (file: string) => Promise<ModelEntry[] | undefined>;
  };
  benchmarksURL?: string;
} = {}): Promise<TierResult> => {
  const MODEL_INDEX = 0;

  const queryBenchmarks = async (
    // tslint:disable-next-line:no-shadowed-variable
    loadBenchmarks = async (
      file: string
    ): Promise<ModelEntry[] | undefined> => {
      try {
        const data = await fetch(`${benchmarksURL}/${file}`).then(
          (response: UnfetchResponse): Promise<any> => response.json()
        );

        return data;
      } catch (err) {
        console.log(err);
        return undefined;
      }
    },
    // tslint:disable-next-line:no-shadowed-variable
    renderer: string
  ): Promise<[number, number, string, string | undefined] | []> => {
    if (debug) {
      console.log('queryBenchmarks', { renderer });
    }

    renderer = renderer
      .toLowerCase()
      // Strip off ANGLE() - for example:
      // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
      .replace(/angle \((.+)\)*$/, '$1')
      // Strip off [number]gb & strip off direct3d and after - for example:
      // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
      // 'Radeon (TM) RX 470 Series'
      .replace(/\s+([0-9]+gb|direct3d.+$)|\(r\)| \([^\)]+\)$/g, '');

    if (debug) {
      console.log('queryBenchmarks - renderer cleaned to', { renderer });
    }

    const types = isMobile
      ? ['adreno', 'apple', 'mali-t', 'mali', 'nvidia', 'powervr']
      : ['intel', 'amd', 'radeon', 'nvidia', 'geforce'];

    let type: string | undefined;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < types.length; i++) {
      const typesType = types[i];

      if (renderer.indexOf(typesType) > -1) {
        type = typesType;
        break;
      }
    }

    if (!type) {
      return [];
    }

    if (debug) {
      console.log('queryBenchmarks - found type:', { type });
    }

    const benchmarkFile = `${isMobile ? 'm' : 'd'}-${type}.json`;

    const benchmark: Promise<ModelEntry[] | undefined> = (queryCache[
      benchmarkFile
    ] = queryCache[benchmarkFile] || loadBenchmarks(benchmarkFile));

    const benchmarks = await benchmark;

    if (!benchmarks) {
      return [];
    }

    const version = getGPUVersion(renderer);

    const isApple = type === 'apple';

    let matched: ModelEntry[] = benchmarks.filter(
      ([, modelVersion]): boolean => modelVersion === version
    );

    if (debug) {
      console.log(
        `found ${matched.length} matching entries using version '${version}':`,
        // tslint:disable-next-line:no-shadowed-variable
        matched.map(([model]): string => model)
      );
    }

    // If nothing matched, try comparing model names:
    if (!matched.length) {
      matched = benchmarks.filter(
        // tslint:disable-next-line:no-shadowed-variable
        ([model]): boolean => model.indexOf(renderer) > -1
      );

      if (debug) {
        console.log(
          `found ${matched.length} matching entries comparing model names`,
          {
            matched,
          }
        );
      }
    }
    const count = matched.length;

    if (count === 0) {
      return [];
    }

    // tslint:disable-next-line:prefer-const
    let [gpu, , blacklisted, fpsesByScreenSize] =
      count > 1
        ? matched
            .map(
              (match): readonly [ModelEntry, number] =>
                [match, leven(renderer, match[MODEL_INDEX])] as const
            )
            .sort(([, a], [, b]): number => a - b)[0][MODEL_INDEX]
        : matched[0];

    if (debug) {
      console.log(
        `${renderer} matched closest to ${gpu} with the following screen sizes`,
        JSON.stringify(fpsesByScreenSize)
      );
    }

    let minDistance = Number.MAX_VALUE;
    let closest: [number, number, number, string];
    const { devicePixelRatio } = window;
    const screenSize =
      screen.width * devicePixelRatio * (screen.height * devicePixelRatio);

    if (isApple) {
      fpsesByScreenSize = fpsesByScreenSize.filter(
        // tslint:disable-next-line:no-shadowed-variable
        ([, , , device]): boolean =>
          device.indexOf(isIpad ? 'ipad' : 'iphone') > -1
      );
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fpsesByScreenSize.length; i++) {
      const match = fpsesByScreenSize[i];
      const [width, height] = match;
      const entryScreenSize = width * height;
      const distance = Math.abs(screenSize - entryScreenSize);

      if (distance < minDistance) {
        minDistance = distance;
        closest = match;
      }
    }

    // If blacklisted change fps to -1
    // TODO: move this to update benchmarks script
    // tslint:disable-next-line:no-shadowed-variable
    const [, , fps, device] = closest!;

    return [minDistance, blacklisted ? -1 : fps, gpu, device];
  };

  const toResult = (
    // tslint:disable-next-line:no-shadowed-variable
    tier: number,
    type: TierType,
    // tslint:disable-next-line:no-shadowed-variable
    fps?: number,
    gpu?: string,
    // tslint:disable-next-line:no-shadowed-variable
    device?: string
  ): TierResult => ({
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
        deviceInfo?.isSafari12,
        failIfMajorPerformanceCaveat
      );

    if (!gl) {
      return toResult(0, 'WEBGL_UNSUPPORTED');
    }

    const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (debugRendererInfo) {
      renderer = gl
        .getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL)
        .toLowerCase();
    }

    if (!renderer) {
      return fallback;
    }

    renderers = deobfuscateRenderer(gl, renderer, isMobile, debug);
  } else {
    renderers = [renderer];
  }

  const results = await Promise.all(
    renderers.map(
      (
        // tslint:disable-next-line:no-shadowed-variable
        renderer: string
      ): Promise<[number, number, string, string | undefined] | []> =>
        queryBenchmarks(loadBenchmarks, renderer)
    )
  );

  const result =
    results.length === 1
      ? results[0]
      : results.sort(
          ([aDis = Number.MAX_VALUE], [bDis = Number.MAX_VALUE]): number =>
            aDis - bDis
        )[0];

  if (result.length === 0) {
    return fallback;
  }

  const [, fps, model, device] = result;

  if (fps === -1) {
    return toResult(0, 'BLACKLISTED', fps, model, device);
  }

  const tiers = isMobile ? mobileTiers : desktopTiers;
  let tier = 0;

  for (let i = 0; i < tiers.length; i++) {
    if (fps >= tiers[i]) {
      tier = i;
    }
  }

  return toResult(tier, 'BENCHMARK', fps, model, device);
};
