export interface IGetGPUTier {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  failIfMajorPerformanceCaveat?: boolean;
  mobileTiers?: number[];
  desktopTiers?: number[];
  override?: {
    renderer?: string;
    isIpad?: boolean;
    isMobile?: boolean;
    screenSize?: { width: number; height: number };
    loadBenchmarks?: (file: string) => Promise<TModelEntry[] | undefined>;
  };
  benchmarksURL?: string;
}

export type TTierType =
  | 'WEBGL_UNSUPPORTED'
  | 'BLACKLISTED'
  | 'FALLBACK'
  | 'BENCHMARK';

export type TTierResult = {
  tier: number;
  type: TTierType;
  isMobile: boolean;
  fps?: number;
  gpu?: string;
  device?: string;
};

export type TModelEntry = [
  string,
  string,
  0 | 1,
  [number, number, number, string][]
];
