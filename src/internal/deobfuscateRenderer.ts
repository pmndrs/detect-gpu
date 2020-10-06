// Internal
import { deobfuscateAppleGpu } from './deobfuscateAppleGpu';

export const deobfuscateRenderer = (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean,
  debug: boolean
): string[] =>
  renderer === 'apple gpu'
    ? deobfuscateAppleGpu(gl, renderer, isMobileTier, debug)
    : [renderer];
