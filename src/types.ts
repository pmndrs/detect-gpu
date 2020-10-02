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

export type ModelEntry = [
  string,
  string,
  0 | 1,
  [number, number, number, string][]
];
