export const getWebGLUnmaskedRenderer = (gl: WebGLRenderingContext): string => {
  const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

  return (
    glExtensionDebugRendererInfo &&
    gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
  );
};
