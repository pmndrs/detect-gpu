import type { TierType, ModelEntry } from './types';
export declare const getGPUTier: ({ mobileTiers, desktopTiers, logging, override: { renderer, isIpad, isMobile, screen, loadBenchmarks, }, glContext, failIfMajorPerformanceCaveat, benchmarksUrl, }?: {
    glContext?: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    failIfMajorPerformanceCaveat?: boolean | undefined;
    mobileTiers?: number[] | undefined;
    desktopTiers?: number[] | undefined;
    logging?: boolean | undefined;
    override?: {
        renderer?: string | undefined;
        isIpad?: boolean | undefined;
        isMobile?: boolean | undefined;
        screen?: {
            width: number;
            height: number;
        } | undefined;
        loadBenchmarks?: ((file: string) => Promise<ModelEntry[] | undefined>) | undefined;
    } | undefined;
    benchmarksUrl?: string | undefined;
}) => Promise<{
    tier: number;
    isMobile: boolean;
    type: TierType;
    fps: number | undefined;
    gpu: string | undefined;
    device: string | undefined;
}>;
