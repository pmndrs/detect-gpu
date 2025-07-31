export function getAppleGPUFromCapabilities(
  gl: WebGLRenderingContext | WebGL2RenderingContext
): string[] {
  // Get various WebGL capabilities that differ between Apple Silicon generations
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  const maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
  const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
  const maxVertexTextureImageUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  const maxCombinedTextureImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  
  // WebGL2 specific capabilities
  let maxDrawBuffers = 4;
  let maxColorAttachments = 4;
  let max3DTextureSize = 0;
  let maxArrayTextureLayers = 0;
  
  if ((gl as WebGL2RenderingContext).MAX_DRAW_BUFFERS) {
    const gl2 = gl as WebGL2RenderingContext;
    maxDrawBuffers = gl2.getParameter(gl2.MAX_DRAW_BUFFERS);
    maxColorAttachments = gl2.getParameter(gl2.MAX_COLOR_ATTACHMENTS);
    max3DTextureSize = gl2.getParameter(gl2.MAX_3D_TEXTURE_SIZE);
    maxArrayTextureLayers = gl2.getParameter(gl2.MAX_ARRAY_TEXTURE_LAYERS);
  }
  
  // Calculate a capability score
  const score = 
    (maxTextureSize / 4096) +
    (maxVertexUniformVectors / 256) +
    (maxFragmentUniformVectors / 256) +
    (maxVaryingVectors / 16) +
    (maxVertexTextureImageUnits / 16) +
    (maxCombinedTextureImageUnits / 32) +
    (maxRenderbufferSize / 8192) +
    (maxDrawBuffers / 4) +
    (maxColorAttachments / 4) +
    (max3DTextureSize / 2048) +
    (maxArrayTextureLayers / 2048);
  
  // Estimate GPU based on capability score
  // These thresholds are approximate and may need tuning
  if (score >= 15) {
    // High-end M-series (M4 Pro/Max, M3 Pro/Max, M2 Ultra, M1 Ultra)
    return ['apple m4 pro', 'apple m4 max', 'apple m3 pro', 'apple m3 max', 'apple m2 ultra', 'apple m1 ultra'];
  } else if (score >= 12) {
    // Mid-range M-series (M4, M3, M2 Pro, M1 Pro/Max)
    return ['apple m4', 'apple m3', 'apple m2 pro', 'apple m1 pro', 'apple m1 max'];
  } else if (score >= 10) {
    // Base M-series (M2, M1)
    return ['apple m2', 'apple m1'];
  } else {
    // Fallback to all desktop Apple GPUs
    return [
      'apple m4 pro', 'apple m4',
      'apple m3 pro', 'apple m3',
      'apple m2 pro', 'apple m2',
      'apple m1 pro', 'apple m1'
    ];
  }
}