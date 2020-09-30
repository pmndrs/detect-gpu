export type TierType =
  | 'WEBGL_UNSUPPORTED'
  | 'BLACKLISTED'
  | 'FALLBACK'
  | 'BENCHMARK';
export type TierResult = {
  tier: number;
  mobile: boolean;
  type: TierType;
  model?: string;
};
export type ModelEntry = [string, string, number, 0 | 1];
