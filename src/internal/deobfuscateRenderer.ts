// Internal
import { deobfuscateAppleGPU } from './deobfuscateAppleGPU';

export function deobfuscateRenderer(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  renderer: string,
  isMobileTier: boolean
) {
  return renderer === 'apple gpu'
    ? deobfuscateAppleGPU(gl, renderer, isMobileTier)
    : [renderer];
}
