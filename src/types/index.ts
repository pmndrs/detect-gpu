export interface IGetGPUTier {
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  mobileBenchmarkPercentages?: number[];
  desktopBenchmarkPercentages?: number[];
  failIfMajorPerformanceCaveat?: boolean;
  forceRendererString?: string;
  forceMobile?: boolean;
}

export type TRank = [number, string] | [undefined, undefined];

export interface IRankWithDistance {
  rank: TRank;
  distance: number;
}
