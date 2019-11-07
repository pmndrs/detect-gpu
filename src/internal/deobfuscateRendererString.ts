export const deobfuscateRendererString = ({ gl, renderer }: { gl: WebGLRenderingContext, renderer: string }): string => {
  console.log(gl);

  return renderer;
};
