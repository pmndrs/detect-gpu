export const deobfuscateRenderer = async (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
) => {
  // if (renderer === 'apple gpu') {
  //   const { deobfuscate } = await import('./deobfuscateAppleGpu');
  //   renderer = deobfuscate(gl, renderer, isMobileTier);
  // }

  return renderer;
};
