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

// Internal
import { deviceInfo } from './deviceInfo';

const debug = false ? console.warn : undefined;

// Apple GPU (iOS 12.2+, Safari 14+)
// SEE: https://github.com/pmndrs/detect-gpu/issues/7
// CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
// CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
export const deobfuscateAppleGPU = (
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
) => {
  let renderers = [renderer];

  if (isMobileTier) {
    const vertexShaderSource = /* glsl */ `
      precision highp float;
      attribute vec3 aPosition;
      varying float vvv;
      void main() {
        vvv = 0.31622776601683794;
        gl_Position = vec4(aPosition, 1.0);
      }
    `;

    const fragmentShaderSource = /* glsl */ `
      precision highp float;
      varying float vvv;
      void main() {
        vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * vvv;
        enc = fract(enc);
        enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
        gl_FragColor = enc;
      }
    `;

    const vertexShader = gl.createShader(GL_VERTEX_SHADER);
    const fragmentShader = gl.createShader(GL_FRAGMENT_SHADER);
    const program = gl.createProgram();

    if (fragmentShader && vertexShader && program) {
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

      gl.clearColor(1, 1, 1, 1);
      gl.clear(GL_COLOR_BUFFER_BIT);
      gl.viewport(0, 0, 1, 1);
      gl.drawArrays(GL_TRIANGLES, 0, 3);

      const pixels = new Uint8Array(4);
      gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_UNSIGNED_BYTE, pixels);

      gl.deleteProgram(program);
      gl.deleteBuffer(vertexArray);
      const id = pixels.join('');
      const { older, newer } = deviceInfo?.isIpad
        ? {
          newer: [
            'apple a12 gpu', // ipad 8th gen / ipad air 3rd gen / ipad mini 5th gen
            'apple a12x gpu', // pro 11 1st gen / pro 12.9 3rd gen
            'apple a12z gpu', // pro 12.9 4th gen / pro 11 2nd gen
            'apple a14 gpu', // ipad air 4th gen
            'apple m1 gpu' // ipad pro 11 2nd gen / 12.9 5th gen
          ],
          older: [
              // Commented out because they don't support ios version >= 13
              // 'apple a4 gpu', // ipad 1st gen
              // 'apple a5 gpu', // ipad 2 / ipad mini 1st gen
              // 'apple a5x gpu', // ipad 3rd gen
              // 'apple a6x gpu', // ipad 4th gen
              'apple a8 gpu', // pad mini 4
              'apple a8x gpu', // ipad air 2
              'apple a9 gpu', // ipad 5th gen
              'apple a9x gpu', // pro 9.7 2016 / pro 12.9 2015
              'apple a10 gpu', // ipad 7th gen / ipad 6th gen
              'apple a10x gpu' // pro 10.5 2017 / pro 12.9 2nd gen, 2017
            ]
          }
        : {
            newer: [
              'apple a11 gpu', // 8 / 8 plus / X
              'apple a12 gpu', // XS / XS Max / XR
              'apple a13 gpu', // 11 / 11 pro / 11 pro max / se 2nd gen
              'apple a14 gpu' // 12 / 12 mini / 12 pro / 12 pro max
            ],
            older: [
              // Commented out because they don't support ios version >= 13
              // 'apple a4 gpu', // 4 / ipod touch 4th gen
              // 'apple a5 gpu', // 4S / ipod touch 5th gen
              // 'apple a6 gpu', // 5 / 5C
              // 'apple a7 gpu', // 5S
              // 'aple a8 gpu', // 6 / 6 plus / ipod touch 6th gen
              'apple a9 gpu', // 6s / 6s plus/ se 1st gen
              'apple a10 gpu' // 7 / 7 plus / iPod Touch 7th gen
            ]
          };
      renderers = (
        {
          // iPhone 11, 11 Pro, 11 Pro Max (Apple A13 GPU)
          // iPad Pro (Apple A12X GPU)
          // iPhone XS, XS Max, XR (Apple A12 GPU)
          // iPhone 8, 8 Plus (Apple A11 GPU)
          '801621810': newer,
          '80162181255': newer,
          // iPhone SE, 6S, 6S Plus (Apple A9 GPU)
          // iPhone 7, 7 Plus (Apple A10 GPU)
          // iPad Pro (Apple A10X GPU)
          '8016218135': older,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      )[id] ?? [...newer, ...older];

      debug?.(
        `iOS 12.2+ obfuscates its GPU type and version, using closest matches: ${renderers}`
      );
    }
  } else {
    debug?.('Safari 14+ obfuscates its GPU type and version, using fallback');
  }

  return renderers;
};
