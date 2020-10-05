import type { TierType, ModelEntry } from './types';
export declare const getGPUTier: ({ mobileTiers, desktopTiers, renderer, mobile, glContext, failIfMajorPerformanceCaveat, screen, benchmarksUrl, loadBenchmarks, }?: {
    glContext?: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    failIfMajorPerformanceCaveat?: boolean | undefined;
    mobileTiers?: number[] | undefined;
    desktopTiers?: number[] | undefined;
    renderer?: string | undefined;
    mobile?: boolean | undefined;
    screen?: {
        width: number;
        height: number;
    } | undefined;
    benchmarksUrl?: string | undefined;
    loadBenchmarks?: ((file: string) => Promise<ModelEntry[] | undefined>) | undefined;
}) => Promise<{
    tier: number;
    mobile: boolean;
    type: TierType;
    model: string | undefined;
    fps: number | undefined;
}>;
