/**
 * @jest-environment jsdom
 */

import { getTier } from './utils';

describe('Desktop Safari GPU Detection', () => {
  it('should handle obfuscated Apple GPU gracefully', async () => {
    const result = await getTier({
      renderer: 'Apple GPU',
      isMobile: false,
      isIpad: false,
      screenSize: { width: 3456, height: 2234 }
    });

    console.log('Test result:', JSON.stringify(result, null, 2));

    // Currently returns FALLBACK since we can't deobfuscate without WebGL context
    expect(result.type).toBe('FALLBACK');
    expect(result.isMobile).toBe(false);
    expect(result.gpu).toContain('apple gpu');
    expect(result.tier).toBe(1);
  });

  it('should detect specific Apple Silicon GPU models', async () => {
    const result = await getTier({
      renderer: 'Apple M4 Pro',
      isMobile: false,
      isIpad: false,
      screenSize: { width: 4112, height: 2658 }
    });

    console.log('M4 Pro test result:', JSON.stringify(result, null, 2));

    // Should return BENCHMARK type
    expect(result.type).toBe('BENCHMARK');
    expect(result.isMobile).toBe(false);
    
    // Should detect Apple M4 Pro GPU
    expect(result.gpu).toBe('apple m4 pro');
    
    // Should have tier 3 (120 fps)
    expect(result.tier).toBe(3);
    expect(result.fps).toBe(120);
  });

  it('should handle various screen sizes for M4 Pro', async () => {
    const screenSizes = [
      { width: 4112, height: 2658 }, // One of M4 Pro's resolutions
      { width: 5120, height: 2880 }, // Another M4 Pro resolution
    ];

    for (const screenSize of screenSizes) {
      const result = await getTier({
        renderer: 'Apple M4 Pro', 
        isMobile: false,
        isIpad: false,
        screenSize
      });

      expect(result.type).toBe('BENCHMARK');
      expect(result.gpu).toBe('apple m4 pro');
      expect(result.tier).toBe(3);
      expect(result.fps).toBe(120);
    }
  });
});