export function isWebGLSupported(attributes) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof window.WebGLRenderingContext)) {
    return false;
  }

  return gl;
}
