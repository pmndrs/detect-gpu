// Vendor
import {
  GL_ARRAY_BUFFER,
  GL_COLOR_BUFFER_BIT,
  GL_COMPILE_STATUS,
  GL_DEPTH_TEST,
  GL_ELEMENT_ARRAY_BUFFER,
  GL_FLOAT,
  GL_FRAGMENT_SHADER,
  GL_LINK_STATUS,
  GL_STATIC_DRAW,
  GL_TRIANGLES,
  GL_UNSIGNED_SHORT,
  GL_VERTEX_SHADER,
} from 'webgl-constants';

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
  const vertexShaderSource = /* glsl */ `
    // precision mediump float;

    // varying float vvv;

    // attribute vec3 position;

    // void main() {
    //   vvv = 0.31622776601683794;

    //   gl_Position = vec4(position.xy, 0.0, 1.0);
    // }

    attribute vec3 position;

    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShaderSource = /* glsl */ `
    // precision mediump float;
    // varying float vvv;

    // vec4 encodeFloatRGBA(float v) {
    //   vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
    //   enc = fract(enc);
    //   enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);

    //   return enc;
    // }

    // void main() {
    //   gl_FragColor = encodeFloatRGBA(vvv);
    // }

    void main() {
      gl_FragColor = vec4()
    }
  `;

  const vertices = new Float32Array([-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
  const indices = new Uint16Array([0, 1, 2]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(GL_ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(GL_ARRAY_BUFFER, vertices, GL_STATIC_DRAW);
  gl.bindBuffer(GL_ARRAY_BUFFER, null);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, indices, GL_STATIC_DRAW);
  gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, null);

  const vertexShader = gl.createShader(GL_VERTEX_SHADER);
  const fragmentShader = gl.createShader(GL_FRAGMENT_SHADER);
  const program = gl.createProgram();

  if (fragmentShader !== null && vertexShader !== null && program !== null) {
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, GL_COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vertexShader));
    }

    if (!gl.getShaderParameter(fragmentShader, GL_COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fragmentShader));
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.validateProgram(program); // TODO: remove

    if (!gl.getProgramParameter(program, GL_LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(program));
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(program);

    gl.bindBuffer(GL_ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, indexBuffer);
    const position = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(position, 3, GL_FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(GL_DEPTH_TEST);
    gl.clear(GL_COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawElements(GL_TRIANGLES, indices.length, GL_UNSIGNED_SHORT, 0);
  }

  console.log(program);

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
  // if (rendererString === 'apple gpu') {
  rendererString = deobfuscateAppleGPU({
    gl,
    rendererString,
  });
  // }

  return rendererString;
};
