import leven from 'leven';
import type { TierType, ModelEntry } from './types';
import { cleanRendererString } from './internal/cleanRendererString';
import { getEntryVersionNumber } from './internal/getEntryVersionNumber';
import { getWebGLUnmaskedRenderer } from './internal/getWebGLUnmaskedRenderer';
import { getSupportedWebGLContext } from './internal/getSupportedWebGLContext';
import { device } from './internal/device';

const debug = false ? console.log : undefined;

export const getGPUTier = async ({
  mobilePercentiles = [0, 50, 30, 20],
  desktopPercentiles = [0, 50, 30, 20],
  renderer,
  mobile = !!device.mobile,
  glContext,
  failIfMajorPerformanceCaveat = true,
}: {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobilePercentiles?: number[];
  desktopPercentiles?: number[];
  renderer?: string;
  mobile?: boolean;
} = {}) => {
  const toResult = (tier: number, type: TierType, model?: string) => ({
    tier,
    mobile,
    type,
    model,
  });

  if (!renderer) {
    const gl =
      glContext ||
      getSupportedWebGLContext(device!.safari12, failIfMajorPerformanceCaveat);

    if (!gl) {
      return toResult(0, 'WEBGL_UNSUPPORTED');
    }

    renderer = getWebGLUnmaskedRenderer(gl);
  }

  const [rank, model] = await getPercentile(renderer!, mobile!);
  if (rank === undefined) {
    return toResult(1, 'FALLBACK');
  } else if (rank === -1) {
    return toResult(0, 'BLACKLISTED');
  }

  let total = 0;
  const tier = (mobile ? mobilePercentiles : desktopPercentiles).findIndex(
    (percentage) => {
      total += percentage;
      return rank <= total;
    }
  );
  return toResult(tier, 'BENCHMARK', model);
};

const MODEL_INDEX = 0;
const VERSION_INDEX = 1;

const getPercentile = async (
  renderer: string,
  mobile: boolean
): Promise<[number, string] | []> => {
  renderer = cleanRendererString(renderer);
  const imports = mobile
    ? {
        adreno: () => import('./data/m-adreno.json'),
        apple: () => import('./data/m-apple.json'),
        'mali-t': () => import('./data/m-mali-t.json'),
        mali: () => import('./data/m-mali.json'),
        nvidia: () => import('./data/m-nvidia.json'),
        powervr: () => import('./data/m-powervr.json'),
      }
    : {
        intel: () => import('./data/d-intel.json'),
        amd: () => import('./data/d-amd.json'),
        radeon: () => import('./data/d-radeon.json'),
        nvidia: () => import('./data/d-nvidia.json'),
        geforce: () => import('./data/d-geforce.json'),
      };
  const type = Object.keys(imports).find((type) => renderer.includes(type));
  debug && debug({ renderer, mobile, type });
  if (!type) return [];
  // @ts-ignore
  const importer = imports[type];
  if (!importer) return [];
  const data: ModelEntry[] = (await importer()).default;
  const version = getEntryVersionNumber(renderer);
  let matched: ModelEntry[] = [];
  for (let i = 0; i < data.length; i++) {
    const match = data[i];
    if (match[VERSION_INDEX] === version) {
      matched.push(match);
    }
  }
  // If nothing matched, try comparing model names:
  if (!matched.length) {
    matched = data.filter((entry) => entry[MODEL_INDEX].includes(renderer));
  }
  const count = matched.length;
  debug && debug({ renderer, version, matched });
  if (count === 0) return [];
  const [model, , percentile, blacklisted] =
    count > 1
      ? matched
          .map((match) => [match, leven(renderer, match[MODEL_INDEX])] as const)
          .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
      : matched[0];
  return [blacklisted ? -1 : percentile, model];
};
