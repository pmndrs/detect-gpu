import { describe, expect, test, vi } from 'vitest';

// `deviceInfo` is built by a module-level IIFE that snapshots
// `window.navigator` at import time. To test different UAs we stub the
// navigator properties and re-import the module via `vi.resetModules()` so
// the IIFE re-runs against the stubbed values.
async function loadDeviceInfo(overrides: {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
}) {
  vi.resetModules();
  const navigator = window.navigator;
  const descriptors = {
    userAgent: Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(navigator),
      'userAgent'
    ),
    platform: Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(navigator),
      'platform'
    ),
    maxTouchPoints: Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(navigator),
      'maxTouchPoints'
    ),
  };
  Object.defineProperty(navigator, 'userAgent', {
    value: overrides.userAgent ?? '',
    configurable: true,
  });
  Object.defineProperty(navigator, 'platform', {
    value: overrides.platform ?? '',
    configurable: true,
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: overrides.maxTouchPoints ?? 0,
    configurable: true,
  });

  const mod = await import('../src/internal/deviceInfo');

  // Restore so other tests see the jsdom defaults.
  if (descriptors.userAgent)
    Object.defineProperty(navigator, 'userAgent', descriptors.userAgent);
  if (descriptors.platform)
    Object.defineProperty(navigator, 'platform', descriptors.platform);
  if (descriptors.maxTouchPoints)
    Object.defineProperty(
      navigator,
      'maxTouchPoints',
      descriptors.maxTouchPoints
    );

  return mod.deviceInfo;
}

describe('deviceInfo.iOSVersion', () => {
  test('parses iPhone OS major version from UA', async () => {
    const info = await loadDeviceInfo({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
      platform: 'iPhone',
    });
    expect(info?.iOSVersion).toBe(26);
  });

  test('parses iPad OS major version from "CPU OS" UA', async () => {
    const info = await loadDeviceInfo({
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      platform: 'iPad',
    });
    expect(info?.iOSVersion).toBe(17);
  });

  test('reads Version/ on iPadOS masquerading as MacIntel (Request Desktop Site)', async () => {
    const info = await loadDeviceInfo({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    });
    expect(info?.isIpad).toBe(true);
    expect(info?.iOSVersion).toBe(17);
  });

  test('is undefined on desktop macOS', async () => {
    const info = await loadDeviceInfo({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    });
    expect(info?.iOSVersion).toBeUndefined();
  });

  test('is undefined on Android', async () => {
    const info = await loadDeviceInfo({
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
    });
    expect(info?.iOSVersion).toBeUndefined();
  });

  test('parses two-digit version correctly (not greedy on underscores)', async () => {
    const info = await loadDeviceInfo({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
    });
    expect(info?.iOSVersion).toBe(18);
  });
});
