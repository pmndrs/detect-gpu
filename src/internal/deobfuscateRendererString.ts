// Apple GPU
// SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/7
// SEE: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
const deobfuscateAppleGPU = ({
  gl,
  rendererString,
}: {
  gl: WebGLRenderingContext;
  rendererString: string;
}): string => {
  const vertexShader = /* glsl */ `
    varying float vvv;

    void main() {
      vvv = 0.31622776601683794;

      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying float vvv;

    vec4 encodeFloatRGBA(float v) {
      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
      enc = fract(enc);
      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);

      return enc;
    }

    void main() {
      gl_FragColor = encodeFloatRGBA(vvv);
    }
  `;

  console.log(gl);

  // Draw a 2x2 planebuffer
  // Add a WebGLRenderTarget
  // Add material (compile the shader) and geometry to a mesh
  // Draw the mesh to the WebGLRenderTarget
  // Read the pixels from the WebGLRenderTarget
  // Clean up

  return rendererString;
};

export const deobfuscateRendererString = ({
  gl,
  rendererString,
}: {
  gl: WebGLRenderingContext;
  rendererString: string;
}): string => {
  // Apple GPU
  // SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/7
  if (rendererString === 'apple gpu') {
    rendererString = deobfuscateAppleGPU({
      gl,
      rendererString,
    });
  }

  return rendererString;
};
