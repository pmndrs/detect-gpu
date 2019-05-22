// Types
import { TVoidable } from '../types';

export const isWebGLSupported = (): TVoidable<WebGLRenderingContext> => {
  const attributes = {
    alpha: false,
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
    stencil: false,
  };

  // Keep reference to the canvas and context in order to clean up
  // after the necessary information has been extracted
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof WebGLRenderingContext)) {
    return;
  }

  return gl;
};
