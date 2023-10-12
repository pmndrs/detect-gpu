// Data
import { version } from '../package.json';

// Internal
import { BLOCKLISTED_GPUS } from './internal/blocklistedGPUS';
import { cleanRenderer } from './internal/cleanRenderer';
import { deobfuscateRenderer } from './internal/deobfuscateRenderer';
import { deviceInfo } from './internal/deviceInfo';
import { OutdatedBenchmarksError } from './internal/error';
import { getGPUVersion } from './internal/getGPUVersion';
import {
  getLevenshteinDistance,
  tokenizeForLevenshteinDistance
} from './internal/getLevenshteinDistance';
import { getWebGLContext } from './internal/getWebGLContext';
import { isSSR } from './internal/ssr';
import { isDefined } from './internal/util';

// Types
export interface GetGPUTier {
  /**
   * URL of directory where benchmark data is hosted.
   *
   * @default https://unpkg.com/detect-gpu@{version}/dist/benchmarks
   */
  benchmarksURL?: string;
  /**
   * Optionally pass in a WebGL context to avoid creating a temporary one
   * internally.
   */
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  /**
   * Whether to fail if the system performance is low or if no hardware GPU is
   * available.
   *
   * @default false
   */
  failIfMajorPerformanceCaveat?: boolean;
  /**
   * Framerate per tier for mobile devices.
   *
   * @defaultValue [0, 15, 30, 60]
   */
  mobileTiers?: number[];
  /**
   * Framerate per tier for desktop devices.
   *
   * @defaultValue [0, 15, 30, 60]
   */
  desktopTiers?: number[];
  /**
   * Optionally override specific parameters. Used mainly for testing.
   */
  override?: {
    renderer?: string;
    /**
     * Override whether device is an iPad.
     */
    isIpad?: boolean;
    /**
     * Override whether device is a mobile device.
     */
    isMobile?: boolean;
    /**
     * Override device screen size.
     */
    screenSize?: { width: number; height: number };
    /**
     * Override how benchmark data is loaded
     */
    loadBenchmarks?: (file: string) => Promise<ModelEntry[]>;
  };
}

export type TierType =
  | 'SSR'
  | 'WEBGL_UNSUPPORTED'
  | 'BLOCKLISTED'
  | 'FALLBACK'
  | 'BENCHMARK';

export type TierResult = {
  tier: number;
  type: TierType;
  isMobile?: boolean;
  fps?: number;
  gpu?: string;
  device?: string;
};

export type ModelEntryScreen = [number, number, number, string | undefined];

export type ModelEntry = [string, string, string, 0 | 1, ModelEntryScreen[]];

const debug = false ? console.log : undefined;

export const getGPUTier = async ({
  mobileTiers = [0, 15, 30, 60],
  desktopTiers = [0, 15, 30, 60],
  override = {},
  glContext,
  failIfMajorPerformanceCaveat = false,
  benchmarksURL = `https://unpkg.com/detect-gpu@${version}/dist/benchmarks`,
}: GetGPUTier = {}): Promise<TierResult> => {
  const queryCache: { [k: string]: Promise<ModelEntry[]> } = {};
  if (isSSR) {
    return {
      tier: 0,
      type: 'SSR',
    };
  }

  const {
    isIpad = !!deviceInfo?.isIpad,
    isMobile = !!deviceInfo?.isMobile,
    screenSize = window.screen,
    loadBenchmarks = async (file: string) => {
      const data: ModelEntry[] = await fetch(`${benchmarksURL}/${file}`).then(
        (response) => response.json()
      );

      // Remove version tag and check version is supported
      const version = parseInt(
        (data.shift() as unknown as string).split('.')[0],
        10
      );
      if (version < 4) {
        throw new OutdatedBenchmarksError(
          'Detect GPU benchmark data is out of date. Please update to version 4x'
        );
      }
      return data;
    },
  } = override;
  let { renderer } = override;
  const getGpuType = (renderer: string) => {
    const types = isMobile
      ? ([
          'adreno',
          'apple',
          'mali-t',
          'mali',
          'nvidia',
          'powervr',
          'samsung',
        ] as const)
      : (['intel', 'apple', 'amd', 'radeon', 'nvidia', 'geforce'] as const);
    for (const type of types) {
      if (renderer.includes(type)) {
        return type;
      }
    }
  };

  async function queryBenchmarks(renderer: string) {
    const type = getGpuType(renderer);
    if (!type) {
      return;
    }

    debug?.('queryBenchmarks - found type:', { type });

    const benchmarkFile = `${isMobile ? 'm' : 'd'}-${type}${
      isIpad ? '-ipad' : ''
    }.json`;

    const benchmark = (queryCache[benchmarkFile] =
      queryCache[benchmarkFile] ?? loadBenchmarks(benchmarkFile));
    let benchmarks: ModelEntry[];
    try {
      benchmarks = await benchmark;
    } catch (error) {
      if (error instanceof OutdatedBenchmarksError) {
        throw error;
      }
      debug?.("queryBenchmarks - couldn't load benchmark:", { error });
      return;
    }

    const version = getGPUVersion(renderer);

    let matched = benchmarks.filter(
      ([, modelVersion]) => modelVersion === version
    );

    debug?.(
      `found ${matched.length} matching entries using version '${version}':`,

      matched.map(([model]) => model)
    );

    // If nothing matched, try comparing model names:
    if (!matched.length) {
      matched = benchmarks.filter(([model]) => model.includes(renderer));

      debug?.(
        `found ${matched.length} matching entries comparing model names`,
        {
          matched,
        }
      );
    }

    const matchCount = matched.length;

    if (matchCount === 0) {
      return;
    }

    const tokenizedRenderer = tokenizeForLevenshteinDistance(renderer);
    // eslint-disable-next-line prefer-const
    let [gpu, , , , fpsesByPixelCount] =
      matchCount > 1
        ? matched
            .map(
              (match) =>
                [
                  match,
                  getLevenshteinDistance(
                    tokenizedRenderer,
                    match[2]
                  ),
                ] as const
            )
            .sort(([, a], [, b]) => a - b)[0][0]
        : matched[0];

    debug?.(
      `${renderer} matched closest to ${gpu} with the following screen sizes`,
      JSON.stringify(fpsesByPixelCount)
    );

    let minDistance = Number.MAX_VALUE;
    let closest: ModelEntryScreen | undefined;
    const { devicePixelRatio } = window;
    const pixelCount =
      screenSize.width *
      devicePixelRatio *
      screenSize.height *
      devicePixelRatio;

    for (const match of fpsesByPixelCount) {
      const [width, height] = match;
      const entryPixelCount = width * height;
      const distance = Math.abs(pixelCount - entryPixelCount);

      if (distance < minDistance) {
        minDistance = distance;
        closest = match;
      }
    }

    if (!closest) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, , fps, device] = closest!;

    return [minDistance, fps, gpu, device] as const;
  }

  const toResult = (
    tier: number,
    type: TierType,
    gpu?: string,
    fps?: number,
    device?: string
  ) => ({
    device,
    fps,
    gpu,
    isMobile,
    tier,
    type,
  });

  let renderers: string[];
  let rawRenderer = '';

  if (!renderer) {
    const gl =
      glContext ||
      getWebGLContext(deviceInfo?.isSafari12, failIfMajorPerformanceCaveat);

    if (!gl) {
      return toResult(0, 'WEBGL_UNSUPPORTED');
    }

    const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (debugRendererInfo) {
      renderer = gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL);
    } else {
      renderer = gl.getParameter(gl.RENDERER);
    }

    if (!renderer) {
      return toResult(1, 'FALLBACK');
    }

    rawRenderer = renderer;
    renderer = cleanRenderer(renderer);
    renderers = deobfuscateRenderer(gl, renderer, isMobile);
  } else {
    renderer = cleanRenderer(renderer);
    renderers = [renderer];
  }

  const results = (await Promise.all(renderers.map(queryBenchmarks)))
    .filter(isDefined)
    .sort(([aDis = Number.MAX_VALUE, aFps], [bDis = Number.MAX_VALUE, bFps]) =>
      aDis === bDis ? aFps - bFps : aDis - bDis
    );
  if (!results.length) {
    const blocklistedModel: string | undefined = BLOCKLISTED_GPUS.find(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (blocklistedModel) => renderer!.includes(blocklistedModel)
    );
    return blocklistedModel
      ? toResult(0, 'BLOCKLISTED', blocklistedModel)
      : toResult(1, 'FALLBACK', `${renderer} (${rawRenderer})`);
  }

  const [, fps, model, device] = results[0];

  if (fps === -1) {
    return toResult(0, 'BLOCKLISTED', model, fps, device);
  }

  const tiers = isMobile ? mobileTiers : desktopTiers;
  let tier = 0;

  for (let i = 0; i < tiers.length; i++) {
    if (fps >= tiers[i]) {
      tier = i;
    }
  }

  return toResult(tier, 'BENCHMARK', model, fps, device);
};
