import type { ModelEntry, TierResult } from './types';
export declare const getGPUTier: ({ mobileTiers, desktopTiers, logging, override: { renderer, isIpad, isMobile, screen, loadBenchmarks, }, glContext, failIfMajorPerformanceCaveat, benchmarksURL, }?: {
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
    benchmarksURL?: string | undefined;
}) => Promise<TierResult>;
