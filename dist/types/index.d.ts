import type { TierType } from './types';
export declare const getGPUTier: ({ mobilePercentiles, desktopPercentiles, renderer, mobile, glContext, failIfMajorPerformanceCaveat, }?: {
    glContext?: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    failIfMajorPerformanceCaveat?: boolean | undefined;
    mobilePercentiles?: number[] | undefined;
    desktopPercentiles?: number[] | undefined;
    renderer?: string | undefined;
    mobile?: boolean | undefined;
}) => Promise<{
    tier: number;
    mobile: boolean;
    type: TierType;
    model: string | undefined;
}>;
