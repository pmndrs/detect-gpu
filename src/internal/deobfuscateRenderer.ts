// Internal
import { deobfuscateAppleGpu } from './deobfuscateAppleGpu';

export const deobfuscateRenderer = (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
) =>
  renderer === 'apple gpu'
    ? deobfuscateAppleGpu(gl, renderer, isMobileTier)
    : [renderer];
