import { isSSR } from './ssr';

export interface WebGPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
  isFallbackAdapter?: boolean;
  isCompatibilityMode?: boolean;
}

export interface WebGPUInfo {
  supported: boolean;
  adapter?: WebGPUAdapterInfo;
  features?: string[];
  limits?: Record<string, number>;
}

export interface GetWebGPUInfoOptions {
  /**
   * Options passed to navigator.gpu.requestAdapter().
   */
  adapterOptions?: unknown;
  /**
   * Whether to include GPUSupportedLimits.
   * @default true
   */
  includeLimits?: boolean;
  /**
   * Whether to include GPUSupportedFeatures.
   * @default true
   */
  includeFeatures?: boolean;
}

export function extractLimits(limits: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  if (!limits || typeof limits !== 'object') return result;

  const target = limits as Record<string, unknown>;
  const proto = Object.getPrototypeOf(target);
  const propertyNames = new Set([
    ...Object.getOwnPropertyNames(target),
    ...(proto ? Object.getOwnPropertyNames(proto) : []),
  ]);

  for (const key of propertyNames) {
    if (key === 'constructor') continue;
    try {
      const val = target[key];
      if (typeof val === 'number') {
        result[key] = val;
      }
    } catch {
      // Ignore getter evaluation errors
    }
  }
  return result;
}

export function extractFeatures(features: unknown): string[] {
  if (!features || typeof features !== 'object') return [];
  if (Array.isArray(features)) return features;
  if (Symbol.iterator in (features as Iterable<string>)) {
    return Array.from(features as Iterable<string>);
  }
  const res: string[] = [];
  if (
    'forEach' in (features as { forEach: (cb: (f: string) => void) => void })
  ) {
    (features as { forEach: (cb: (f: string) => void) => void }).forEach(
      (f: string) => res.push(f)
    );
  }
  return res;
}

export const getWebGPUInfo = async ({
  adapterOptions,
  includeLimits = true,
  includeFeatures = true,
}: GetWebGPUInfoOptions = {}): Promise<WebGPUInfo> => {
  if (isSSR || typeof navigator === 'undefined' || !('gpu' in navigator)) {
    return { supported: false };
  }

  const nav = navigator as unknown as {
    gpu?: {
      requestAdapter: (options?: unknown) => Promise<{
        info?: Record<string, unknown>;
        requestAdapterInfo?: () => Promise<Record<string, unknown>>;
        isFallbackAdapter?: boolean;
        isCompatibilityMode?: boolean;
        features?: unknown;
        limits?: unknown;
      } | null>;
    };
  };

  const gpu = nav.gpu;
  if (!gpu || typeof gpu.requestAdapter !== 'function') {
    return { supported: false };
  }

  try {
    const adapter = await gpu.requestAdapter(adapterOptions);
    if (!adapter) {
      return { supported: false };
    }

    let adapterInfo: Record<string, unknown> | undefined = adapter.info;
    if (!adapterInfo && typeof adapter.requestAdapterInfo === 'function') {
      try {
        adapterInfo = await adapter.requestAdapterInfo();
      } catch {
        // Ignore legacy adapter info request failure
      }
    }

    const adapterResult: WebGPUAdapterInfo = {};
    if (adapterInfo) {
      if (typeof adapterInfo.vendor === 'string')
        adapterResult.vendor = adapterInfo.vendor;
      if (typeof adapterInfo.architecture === 'string')
        adapterResult.architecture = adapterInfo.architecture;
      if (typeof adapterInfo.device === 'string')
        adapterResult.device = adapterInfo.device;
      if (typeof adapterInfo.description === 'string')
        adapterResult.description = adapterInfo.description;
    }

    if (typeof adapter.isFallbackAdapter === 'boolean') {
      adapterResult.isFallbackAdapter = adapter.isFallbackAdapter;
    } else if (typeof adapterInfo?.isFallbackAdapter === 'boolean') {
      adapterResult.isFallbackAdapter = adapterInfo.isFallbackAdapter;
    }

    if (typeof adapter.isCompatibilityMode === 'boolean') {
      adapterResult.isCompatibilityMode = adapter.isCompatibilityMode;
    } else if (typeof adapterInfo?.isCompatibilityMode === 'boolean') {
      adapterResult.isCompatibilityMode = adapterInfo.isCompatibilityMode;
    }

    const result: WebGPUInfo = {
      supported: true,
      adapter:
        Object.keys(adapterResult).length > 0 ? adapterResult : undefined,
    };

    if (includeFeatures && adapter.features) {
      result.features = extractFeatures(adapter.features);
    }

    if (includeLimits && adapter.limits) {
      result.limits = extractLimits(adapter.limits);
    }

    return result;
  } catch {
    return { supported: false };
  }
};
