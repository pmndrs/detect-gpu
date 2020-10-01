export interface IGetGPUTier {
    glContext?: WebGLRenderingContext | WebGL2RenderingContext;
    mobileBenchmarkPercentages?: number[];
    desktopBenchmarkPercentages?: number[];
    failIfMajorPerformanceCaveat?: boolean;
    forceRendererString?: string;
    forceMobile?: boolean;
}
export declare type TRank = [number, string] | [undefined, undefined];
export interface IRankWithDistance {
    rank: TRank;
    distance: number;
}
export declare const getGPUTier: ({ mobileBenchmarkPercentages, desktopBenchmarkPercentages, forceRendererString, forceMobile, glContext, failIfMajorPerformanceCaveat, }?: IGetGPUTier) => {
    tier: string;
    type: string;
};
