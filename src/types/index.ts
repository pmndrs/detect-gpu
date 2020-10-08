export interface GetGPUTier {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  override?: {
    renderer?: string;
    isIpad?: boolean;
    isMobile?: boolean;
    screenSize?: { width: number; height: number };
    loadBenchmarks?: (file: string) => Promise<ModelEntry[] | undefined>;
  };
  benchmarksURL?: string;
}

export type TierType =
  | 'WEBGL_UNSUPPORTED'
  | 'BLACKLISTED'
  | 'FALLBACK'
  | 'BENCHMARK';

export type TierResult = {
  tier: number;
  type: TierType;
  isMobile: boolean;
  fps?: number;
  gpu?: string;
  device?: string;
};

export type ModelEntryScreen = [number, number, number, string | undefined];

export type ModelEntry = [string, string, 0 | 1, ModelEntryScreen[]];
