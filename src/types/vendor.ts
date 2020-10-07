type UnfetchResponse = {
  ok: boolean;
  statusText: string;
  status: number;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<any>;
  blob: () => Promise<Blob>;
  clone: () => UnfetchResponse;
  headers: {
    keys: () => string[];
    entries: () => [string, string][];
    get: (key: string) => string | undefined;
    has: (key: string) => boolean;
  };
};

type Unfetch = (
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    credentials?: 'include' | 'omit';
    body?: Parameters<XMLHttpRequest['send']>[0];
  }
) => Promise<UnfetchResponse>;
