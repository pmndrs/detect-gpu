// Internal
import { deobfuscateAppleGpu } from './deobfuscateAppleGpu';

export const deobfuscateRenderer = (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
): string[] =>
  renderer === 'apple gpu'
    ? deobfuscateAppleGpu(gl, renderer, isMobileTier)
    : [renderer];
