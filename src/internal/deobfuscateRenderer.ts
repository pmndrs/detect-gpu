// Internal
import { deobfuscateAppleGPU } from './deobfuscateAppleGPU';

export const deobfuscateRenderer = (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
) =>
  renderer === 'apple gpu'
    ? deobfuscateAppleGPU(gl, renderer, isMobileTier)
    : [renderer];
