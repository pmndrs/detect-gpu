import { describe, expect, test } from 'vitest';

import { filterByIOSVersion } from '../src/internal/deobfuscateAppleGPU';

// Minimal shape matching the possibleChipsets tuple in deobfuscateAppleGPU.ts.
// The filter only reads the first element (gpu name) so the rest is ignored.
type Chipset = readonly [string, unknown, number];

const iphoneChipsets: Chipset[] = [
  ['a7', 'code', 12],
  ['a8', 'code', 12],
  ['a9', 'code', 15],
  ['a10', 'code', 15],
  ['a11', 'code', 15],
  ['a12', 'code', 15],
  ['a13', 'code', 15],
  ['a14', 'code', 15],
  ['a15', 'code', 15],
  ['a16', 'code', 15],
  ['a17 pro', 'code', 15],
  ['a18', 'code', 15],
  ['a18 pro', 'code', 15],
  ['a19', 'code', 15],
  ['a19 pro', 'code', 15],
];

const ipadChipsets: Chipset[] = [
  ['a7', 'code', 12],
  ['a8', 'code', 15],
  ['a8x', 'code', 15],
  ['a9', 'code', 15],
  ['a9x', 'code', 15],
  ['a10', 'code', 15],
  ['a10x', 'code', 15],
  ['a12', 'code', 15],
  ['a12x', 'code', 15],
  ['a12z', 'code', 15],
  ['a14', 'code', 15],
  ['a15', 'code', 15],
  ['a16', 'code', 15],
  ['a17 pro', 'code', 15],
  ['m1', 'code', 15],
  ['m2', 'code', 15],
  ['m3', 'code', 15],
  ['m4', 'code', 15],
  ['m5', 'code', 15],
];

const names = (chipsets: Chipset[]) => chipsets.map(([gpu]) => gpu);

describe('filterByIOSVersion', () => {
  test('returns every chipset when iOS version is unknown', () => {
    expect(filterByIOSVersion(iphoneChipsets, undefined, false)).toEqual(
      iphoneChipsets
    );
    expect(filterByIOSVersion(ipadChipsets, undefined, true)).toEqual(
      ipadChipsets
    );
  });

  test('applies no cutoff below iOS 13', () => {
    expect(names(filterByIOSVersion(iphoneChipsets, 12, false))).toEqual(
      names(iphoneChipsets)
    );
  });

  test('iOS 13 drops A8 and below on iPhone (requires A9+)', () => {
    const result = names(filterByIOSVersion(iphoneChipsets, 13, false));
    expect(result).not.toContain('a7');
    expect(result).not.toContain('a8');
    expect(result[0]).toBe('a9');
  });

  test('iOS 16 drops A9 and below on iPhone (requires A10+)', () => {
    const result = names(filterByIOSVersion(iphoneChipsets, 16, false));
    expect(result).not.toContain('a9');
    expect(result[0]).toBe('a10');
  });

  test('iOS 17 drops A11 and below on iPhone (requires A12+)', () => {
    const result = names(filterByIOSVersion(iphoneChipsets, 17, false));
    expect(result).not.toContain('a10');
    expect(result).not.toContain('a11');
    expect(result[0]).toBe('a12');
  });

  test('iOS 18 uses the same cutoff as iOS 17', () => {
    expect(names(filterByIOSVersion(iphoneChipsets, 18, false))).toEqual(
      names(filterByIOSVersion(iphoneChipsets, 17, false))
    );
  });

  test('iPadOS 16 drops A8x and below on iPad (requires A9+)', () => {
    const result = names(filterByIOSVersion(ipadChipsets, 16, true));
    expect(result).not.toContain('a8');
    expect(result).not.toContain('a8x');
    expect(result[0]).toBe('a9');
  });

  test('iPadOS 17 drops A9x and below on iPad (requires A10+)', () => {
    const result = names(filterByIOSVersion(ipadChipsets, 17, true));
    expect(result).not.toContain('a9');
    expect(result).not.toContain('a9x');
    expect(result[0]).toBe('a10');
  });

  test('iOS 26 drops A12 and below on iPhone (requires A13+)', () => {
    const result = names(filterByIOSVersion(iphoneChipsets, 26, false));
    expect(result).toEqual([
      'a13',
      'a14',
      'a15',
      'a16',
      'a17 pro',
      'a18',
      'a18 pro',
      'a19',
      'a19 pro',
    ]);
  });

  test('iPadOS 26 drops A10 and below on iPad (requires A12+/Neural Engine)', () => {
    const result = names(filterByIOSVersion(ipadChipsets, 26, true));
    expect(result).toEqual([
      'a12',
      'a12x',
      'a12z',
      'a14',
      'a15',
      'a16',
      'a17 pro',
      'm1',
      'm2',
      'm3',
      'm4',
      'm5',
    ]);
  });

  test('all M-series chips pass every iOS cutoff', () => {
    const mOnly: Chipset[] = [
      ['m1', 'code', 15],
      ['m2', 'code', 15],
      ['m3', 'code', 15],
      ['m4', 'code', 15],
      ['m5', 'code', 15],
    ];
    expect(names(filterByIOSVersion(mOnly, 26, true))).toEqual(names(mOnly));
    expect(names(filterByIOSVersion(mOnly, 99, true))).toEqual(names(mOnly));
  });
});
