export declare type TierType = 'WEBGL_UNSUPPORTED' | 'BLACKLISTED' | 'FALLBACK' | 'BENCHMARK';
export declare type TierResult = {
    tier: number;
    mobile: boolean;
    type: TierType;
    model?: string;
};
export declare type ModelEntry = [
    string,
    string,
    0 | 1,
    [
        number,
        number,
        number,
        string
    ][]
];
