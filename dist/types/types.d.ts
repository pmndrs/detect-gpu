export declare type TierType = 'WEBGL_UNSUPPORTED' | 'BLACKLISTED' | 'FALLBACK' | 'BENCHMARK';
export declare type TierResult = {
    tier: number;
    mobile: boolean;
    type: TierType;
    model?: string;
};
export declare type ModelEntry = [string, string, number, 0 | 1];
