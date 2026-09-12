import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getWebGPUInfo,
  extractLimits,
  extractFeatures,
} from '../src/internal/getWebGPUInfo';
import { getGPUTier } from '../src';

describe('WebGPU Device Info Detection', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('returns supported: false when navigator.gpu is missing', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      writable: true,
      configurable: true,
    });

    const info = await getWebGPUInfo();
    expect(info.supported).toBe(false);
    expect(info.adapter).toBeUndefined();
  });

  it('extracts features from Set-like GPUSupportedFeatures', () => {
    const mockFeatures = new Set([
      'texture-compression-bc',
      'shader-f16',
      'timestamp-query',
    ]);
    const list = extractFeatures(mockFeatures);
    expect(list).toEqual([
      'texture-compression-bc',
      'shader-f16',
      'timestamp-query',
    ]);
  });

  it('extracts limits including prototype getters', () => {
    class MockLimits {
      get maxTextureDimension2D() {
        return 8192;
      }
      get maxComputeWorkgroupSizeX() {
        return 256;
      }
      get maxBufferSize() {
        return 268435456;
      }
    }
    const limits = new MockLimits();
    const extracted = extractLimits(limits);
    expect(extracted.maxTextureDimension2D).toBe(8192);
    expect(extracted.maxComputeWorkgroupSizeX).toBe(256);
    expect(extracted.maxBufferSize).toBe(268435456);
  });

  it('detects WebGPU adapter info, features, and limits when available', async () => {
    const mockAdapter = {
      info: {
        vendor: 'nvidia',
        architecture: 'ampere',
        device: 'RTX 3080',
        description: 'NVIDIA GeForce RTX 3080',
      },
      isFallbackAdapter: false,
      isCompatibilityMode: false,
      features: new Set(['texture-compression-bc', 'shader-f16']),
      limits: {
        maxTextureDimension2D: 16384,
        maxBufferSize: 1073741824,
      },
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
        },
      },
      writable: true,
      configurable: true,
    });

    const info = await getWebGPUInfo();
    expect(info.supported).toBe(true);
    expect(info.adapter).toBeDefined();
    expect(info.adapter?.vendor).toBe('nvidia');
    expect(info.adapter?.architecture).toBe('ampere');
    expect(info.adapter?.device).toBe('RTX 3080');
    expect(info.adapter?.description).toBe('NVIDIA GeForce RTX 3080');
    expect(info.adapter?.isFallbackAdapter).toBe(false);
    expect(info.features).toContain('shader-f16');
    expect(info.limits?.maxTextureDimension2D).toBe(16384);
  });

  it('supports legacy requestAdapterInfo() fallback', async () => {
    const mockAdapter = {
      requestAdapterInfo: vi.fn().mockResolvedValue({
        vendor: 'apple',
        architecture: 'apple-m2',
        device: 'Apple M2',
        description: 'Apple M2 Metal',
      }),
      isFallbackAdapter: false,
      features: new Set([]),
      limits: {},
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
        },
      },
      writable: true,
      configurable: true,
    });

    const info = await getWebGPUInfo();
    expect(info.supported).toBe(true);
    expect(info.adapter?.vendor).toBe('apple');
    expect(info.adapter?.device).toBe('Apple M2');
  });

  it('includes webgpu info in getGPUTier when webgpu: true', async () => {
    const mockAdapter = {
      info: {
        vendor: 'amd',
        device: 'Radeon RX 6800',
        description: 'AMD Radeon RX 6800',
      },
      isFallbackAdapter: false,
      features: new Set(['float32-filterable']),
      limits: {
        maxTextureDimension2D: 16384,
      },
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
        },
      },
      writable: true,
      configurable: true,
    });

    const result = await getGPUTier({
      webgpu: true,
      override: {
        renderer: 'amd radeon rx 6800',
      },
    });

    expect(result.webgpu).toBeDefined();
    expect(result.webgpu?.supported).toBe(true);
    expect(result.webgpu?.adapter?.vendor).toBe('amd');
    expect(result.webgpu?.features).toContain('float32-filterable');
  });
});
