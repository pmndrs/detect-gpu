// @ts-check
export function getWebGLUnmaskedRenderer() {
  const attributes = {
    alpha: false,
    stencil: false,
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
  };

  // Keep reference to the canvas and context in order to clean up
  // after the necessary information has been extracted
  let canvas = document.createElement('canvas');
  let gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof WebGLRenderingContext)) {
    return false;
  }

  const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');

  const renderer = glExtensionDebugRendererInfo
    && gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);

  // Clean up canvas and WebGL context
  canvas = undefined;
  gl = undefined;

  return renderer;
}

// Get benchmark entry's by percentage of the total benchmark entries
export function getBenchmarkByPercentage(benchmark, percentages) {
  let chunkOffset = 0;

  const benchmarkTiers = percentages.map((percentage) => {
    const chunkSize = Math.round((benchmark.length / 100) * percentage);
    const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);

    chunkOffset += chunkSize;

    return chunk;
  });

  return benchmarkTiers;
}
