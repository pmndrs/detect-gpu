// Vendor
import {
  GL_ARRAY_BUFFER,
  GL_COLOR_BUFFER_BIT,
  GL_FLOAT,
  GL_FRAGMENT_SHADER,
  GL_RGBA,
  GL_STATIC_DRAW,
  GL_TRIANGLES,
  GL_UNSIGNED_BYTE,
  GL_VERTEX_SHADER,
} from 'webgl-constants';

// Apple GPU
// SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/7
// CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
// CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
const deobfuscateAppleGPU = ({
  gl,
  rendererString,
}: {
  gl: WebGLRenderingContext;
  rendererString: string;
}): string => {
  const vertexShaderSource = /* glsl */ `
    precision highp float;

    attribute vec3 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = /* glsl */ `
    precision highp float;

    void main() {
      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * 0.31622776601683794;
      enc = fract(enc);
      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);

      gl_FragColor = enc;
    }
  `;

  const vertexShader = gl.createShader(GL_VERTEX_SHADER);
  const fragmentShader = gl.createShader(GL_FRAGMENT_SHADER);
  const program = gl.createProgram();

  if (fragmentShader !== null && vertexShader !== null && program !== null) {
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    gl.useProgram(program);

    const vertexArray = gl.createBuffer();
    gl.bindBuffer(GL_ARRAY_BUFFER, vertexArray);
    gl.bufferData(
      GL_ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      GL_STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 3, GL_FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(GL_COLOR_BUFFER_BIT);
    gl.viewport(0, 0, 1, 1);
    gl.drawArrays(GL_TRIANGLES, 0, 3);

    const pixels = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_UNSIGNED_BYTE, pixels);
    const result = pixels.join('');

    gl.deleteProgram(program);
    gl.deleteBuffer(vertexArray);

    document.body.appendChild(document.createTextNode(result));

    switch (result) {
      // Unknown:
      // iPhone 11, 11 Pro, 11 Pro Max (Apple A13 GPU)

      case '801621810':
        // iPhone XS, XS Max, XR (Apple A12 GPU)
        // iPhone 8, 8 Plus (Apple A11 GPU)
        return 'apple a11 gpu';
      case '8016218135':
        // iPhone 6S, 6S Plus (Apple A9 GPU)
        // iPhone 7, 7 Plus (Apple A10 GPU)
        return 'apple a10 gpu';
    }
  }

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
  // CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
  // CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
  if (rendererString === 'apple gpu') {
    rendererString = deobfuscateAppleGPU({
      gl,
      rendererString,
    });
  }

  return rendererString;
};
