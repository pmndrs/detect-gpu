import leven from 'leven';
import type { TierType, ModelEntry } from './types';
import { cleanRendererString } from './internal/cleanRendererString';
import { getEntryVersionNumber } from './internal/getEntryVersionNumber';
import { getWebGLUnmaskedRenderer } from './internal/getWebGLUnmaskedRenderer';
import { getSupportedWebGLContext } from './internal/getSupportedWebGLContext';
import { device } from './internal/device';
import { deobfuscateRenderer } from './internal/deobfuscateRenderer';

const debug = false ? console.log : undefined;

export const getGPUTier = async ({
  mobileTiers = [0, 30, 65],
  desktopTiers = [0, 30, 65],
  renderer,
  mobile = !!device.mobile,
  glContext,
  failIfMajorPerformanceCaveat = true,
  screen = typeof window === 'undefined'
    ? { width: 1920, height: 1080 }
    : window.screen,
}: {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  renderer?: string;
  mobile?: boolean;
  screen?: { width: number; height: number };
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

  if (!renderer) {
    const gl =
      glContext ||
      getSupportedWebGLContext(device!.safari12, failIfMajorPerformanceCaveat);

    if (!gl) {
      return toResult(0, 'WEBGL_UNSUPPORTED');
    }
    renderer = getWebGLUnmaskedRenderer(gl);
  }
  const [fps, model] = await getTestFPS(renderer!, mobile!, screen);
  if (fps === undefined) {
    return toResult(1, 'FALLBACK');
  } else if (fps === -1) {
    return toResult(0, 'BLACKLISTED');
  }
  const tiers = mobile ? mobileTiers : desktopTiers;
  const tier = tiers.findIndex((tierFps) => tierFps >= fps);
  return toResult(
    tier === -1 ? tiers.length - 1 : tier,
    'BENCHMARK',
    model,
    fps
  );
};

const MODEL_INDEX = 0;
const VERSION_INDEX = 1;

const getTestFPS = async (
  renderer: string,
  mobile: boolean,
  screen: {
    width: number;
    height: number;
  }
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
  const [model, , blacklisted, fpsesByScreenSize] =
    count > 1
      ? matched
          .map((match) => [match, leven(renderer, match[MODEL_INDEX])] as const)
          .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
      : matched[0];
  let closestFps: number;
  let minDistance = Number.MAX_VALUE;
  const screenSize = screen.width * screen.height;
  for (let i = 0; i < fpsesByScreenSize.length; i++) {
    let [width, height, fps] = fpsesByScreenSize[i];
    const entryScreenSize = width * height;
    const distance = Math.abs(screenSize - entryScreenSize);
    if (distance < minDistance) {
      minDistance = distance;
      closestFps = fps;
    }
  }
  return [blacklisted ? -1 : closestFps!, model];
};
