"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Vendor
const webgl_constants_1 = require("webgl-constants");
// Apple GPU
const deobfuscateAppleGPU = ({ gl, rendererString, }) => {
    const vertexShaderSource = /* glsl */ `
    precision highp float;

    attribute vec3 position;

    varying float vvv;

    void main() {
      vvv = 0.31622776601683794;

      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;
    const fragmentShaderSource = /* glsl */ `
    precision highp float;

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
    const vertexShader = gl.createShader(webgl_constants_1.GL_VERTEX_SHADER);
    const fragmentShader = gl.createShader(webgl_constants_1.GL_FRAGMENT_SHADER);
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
        gl.bindBuffer(webgl_constants_1.GL_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(webgl_constants_1.GL_ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), webgl_constants_1.GL_STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.vertexAttribPointer(position, 3, webgl_constants_1.GL_FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(position);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(webgl_constants_1.GL_COLOR_BUFFER_BIT);
        gl.viewport(0, 0, 1, 1);
        gl.drawArrays(webgl_constants_1.GL_TRIANGLES, 0, 3);
        const pixels = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, webgl_constants_1.GL_RGBA, webgl_constants_1.GL_UNSIGNED_BYTE, pixels);
        const result = Array.from(pixels).join('');
        document.body.appendChild(document.createTextNode(result));
        switch (result) {
            case '801621810':
                // iPhone 8
                return 'apple a11 gpu';
            case '8016218135':
                // iPhone 7
                return 'apple a10 gpu';
            default:
                return rendererString;
        }
    }
    return rendererString;
};
exports.deobfuscateRendererString = ({ gl, rendererString, }) => {
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
//# sourceMappingURL=deobfuscateRendererString.js.map