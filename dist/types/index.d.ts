import { IGetGPUTier } from './types';
export declare const getGPUTier: ({ mobileBenchmarkPercentages, desktopBenchmarkPercentages, forceRendererString, forceMobile, glContext, failIfMajorPerformanceCaveat, }?: IGetGPUTier) => {
    tier: string;
    type: string;
};
