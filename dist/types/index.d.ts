export interface IGetGPUTier {
    glContext?: WebGLRenderingContext | WebGL2RenderingContext;
    mobileBenchmarkPercentages?: number[];
    desktopBenchmarkPercentages?: number[];
    forceRendererString?: string;
    forceMobile?: boolean;
}
export declare const getGPUTier: (options?: IGetGPUTier) => {
    tier: string;
    type: string;
};
