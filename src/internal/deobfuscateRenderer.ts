// Internal
import { deobfuscateAppleGPU } from './deobfuscateAppleGPU';

export const deobfuscateRenderer = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  renderer: string,
  isMobileTier: boolean
) => {
  if (renderer === 'apple gpu') {
    return deobfuscateAppleGPU(gl, renderer, isMobileTier);
  } else {
    return [renderer];
  }
};
