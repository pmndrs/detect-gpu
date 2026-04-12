export function getWebGLContext(
  isSafari12?: boolean,
  failIfMajorPerformanceCaveat = false
) {
  const attributes: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat,
    powerPreference: 'high-performance',
    stencil: false,
  };

  // Workaround for Safari 12, which otherwise crashes with powerPreference set
  // to high-performance: https://github.com/pmndrs/detect-gpu/issues/5
  if (isSafari12) {
    delete attributes.powerPreference;
  }

  const canvas = window.document.createElement('canvas');
  return canvas.getContext('webgl', attributes) ?? undefined;
}
