import { deviceInfo } from './deviceInfo';

// WebGL enum values, inlined to avoid a dep on `webgl-constants`. Same
// numbers as `gl.ARRAY_BUFFER` etc., which minifiers can't fold because
// they're property accesses. SEE:
// https://registry.khronos.org/webgl/specs/latest/1.0/#5.14
const GL_ARRAY_BUFFER = 0x8892;
const GL_COLOR_BUFFER_BIT = 0x4000;
const GL_FLOAT = 0x1406;
const GL_FRAGMENT_SHADER = 0x8b30;
const GL_RGBA = 0x1908;
const GL_STATIC_DRAW = 0x88e4;
const GL_TRIANGLES = 0x0004;
const GL_UNSIGNED_BYTE = 0x1401;
const GL_VERTEX_SHADER = 0x8b31;

const debug = false ? console.warn : undefined;

export function deobfuscateAppleGPU(
  gl: WebGLRenderingContext,
  renderer: string,
  isMobileTier: boolean
) {
  if (!isMobileTier) {
    debug?.('Safari 14+ obfuscates its GPU type and version, using fallback');
    return [renderer];
  }
  const codeA = '801621810' as const;
  const codeB = '8016218135' as const;
  const codeC = '80162181161' as const;
  const codeFB = '80162181255';

  // All chipsets that support at least iOS 12:
  let chipsets: [string, typeof codeA | typeof codeB | typeof codeC, number][] =
    deviceInfo?.isIpad
      ? [
          // ['a4', 5], // ipad 1st gen
          // ['a5', 9], // ipad 2 / ipad mini 1st gen
          // ['a5x', 9], // ipad 3rd gen
          // ['a6x', 10], // ipad 4th gen
          ['a7', codeC, 12], // ipad air / ipad mini 2 / ipad mini 3
          ['a8', codeB, 15], // pad mini 4
          ['a8x', codeB, 15], // ipad air 2
          ['a9', codeB, 15], // ipad 5th gen
          ['a9x', codeB, 15], // pro 9.7 2016 / pro 12.9 2015
          ['a10', codeB, 15], // ipad 7th gen / ipad 6th gen
          ['a10x', codeB, 15], // pro 10.5 2017 / pro 12.9 2nd gen, 2017
          ['a12', codeA, 15], // ipad 8th gen / ipad air 3rd gen / ipad mini 5th gen
          ['a12x', codeA, 15], // ipad pro 11 3st gen / ipad pro 12.9 3rd gen
          ['a12z', codeA, 15], // ipad pro 11 4nd gen / ipad pro 12.9 4th gen
          ['a14', codeA, 15], // ipad air 4th gen
          ['a15', codeA, 15], // ipad mini 6th gen / ipad 10th gen
          ['a16', codeA, 15], // ipad air 11 / ipad air 13 (a16, 2025) / ipad 11th gen
          ['a17 pro', codeA, 15], // ipad mini 7th gen
          ['m1', codeA, 15], // ipad pro 11 5nd gen / ipad pro 12.9 5th gen / ipad air 5th gen
          ['m2', codeA, 15], // ipad pro 11 6nd gen / ipad pro 12.9 6th gen
          ['m3', codeA, 15], // ipad air 11-inch (m3, 2025) / ipad air 13-inch (m3, 2025)
          ['m4', codeA, 15], // ipad pro 11-inch (m4, 2024) / ipad pro 13-inch (m4, 2024)
          ['m5', codeA, 15], // ipad pro 11-inch (m5, 2025) / ipad pro 13-inch (m5, 2025)
        ]
      : [
          // ['a4', 7], // 4 / ipod touch 4th gen
          // ['a5', 9], // 4S / ipod touch 5th gen
          // ['a6', 10], // 5 / 5C
          ['a7', codeC, 12], // 5S
          ['a8', codeB, 12], // 6 / 6 plus / ipod touch 6th gen
          ['a9', codeB, 15], // 6s / 6s plus/ se 1st gen
          ['a10', codeB, 15], // 7 / 7 plus / iPod Touch 7th gen
          ['a11', codeA, 15], // 8 / 8 plus / X
          ['a12', codeA, 15], // XS / XS Max / XR
          ['a13', codeA, 15], // 11 / 11 pro / 11 pro max / se 2nd gen
          ['a14', codeA, 15], // 12 / 12 mini / 12 pro / 12 pro max
          ['a15', codeA, 15], // 13 / 13 mini / 13 pro / 13 pro max / se 3rd gen / 14 / 14 plus
          ['a16', codeA, 15], // 14 pro / 14 pro max / 15 / 15 plus
          ['a17 pro', codeA, 15], // 15 pro / 15 pro max
          ['a18', codeA, 15], // iphone 16 / iphone 16 plus / iphone 16e
          ['a18 pro', codeA, 15], // iphone 16 pro / iphone 16 pro max
          ['a19', codeA, 15], // iphone 17
          ['a19 pro', codeA, 15], // iphone 17 air / iphone 17 pro / iphone 17 pro max
        ];
  // On iOS 14+ the pixel ID was normalized by Apple and only tells us
  // "iOS 14+" — which the UA-based iOSVersion already does, without a
  // WebGL draw call. Skip the shader when we can.
  const skipShader =
    deviceInfo?.iOSVersion !== undefined && deviceInfo.iOSVersion >= 14;
  if (!skipShader) {
    const pixelId = calculateMagicPixelId(gl);
    if (pixelId === codeFB) {
      chipsets = chipsets.filter(([, , iosVersion]) => iosVersion >= 14);
    } else {
      const matched = chipsets.filter(([, id]) => id === pixelId);
      if (matched.length) chipsets = matched;
    }
  }
  chipsets = filterByIOSVersion(
    chipsets,
    deviceInfo?.iOSVersion,
    !!deviceInfo?.isIpad
  );
  const renderers = chipsets.map(([gpu]) => `apple ${gpu} gpu`);
  debug?.(
    `iOS 12.2+ obfuscates its GPU type and version, using closest matches: ${JSON.stringify(
      renderers
    )}`
  );
  return renderers;
}

const IOS_CHIP_CUTOFFS = [
  { minIOS: 13, iphone: 9, ipad: 8 },
  { minIOS: 16, iphone: 10, ipad: 9 },
  { minIOS: 17, iphone: 12, ipad: 10 },
  { minIOS: 26, iphone: 13, ipad: 12 },
];

function minimumAChip(iOSVersion: number, isIpad: boolean): number {
  const cutoff = IOS_CHIP_CUTOFFS.findLast((c) => iOSVersion >= c.minIOS);
  return cutoff ? (isIpad ? cutoff.ipad : cutoff.iphone) : 0;
}

// Drop A-series chipsets that cannot run the detected iOS major. M-series
// chips (2021+) and any unrecognized prefix are preserved.
/** @internal — exported for test access only. */
export function filterByIOSVersion<T extends readonly [string, ...unknown[]]>(
  chipsets: T[],
  iOSVersion: number | undefined,
  isIpad: boolean
): T[] {
  if (!iOSVersion) return chipsets;
  const minAChip = minimumAChip(iOSVersion, isIpad);
  if (!minAChip) return chipsets;
  return chipsets.filter(([gpu]) => {
    if (gpu.startsWith('m')) return true;
    const match = /^a(\d+)/.exec(gpu);
    return match ? parseInt(match[1], 10) >= minAChip : true;
  });
}

// Apple GPU (iOS 12.2+, Safari 14+)
// SEE: https://github.com/pmndrs/detect-gpu/issues/7
// CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
// CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
function calculateMagicPixelId(gl: WebGLRenderingContext) {
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
  if (!(fragmentShader && vertexShader && program)) return;
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
  return pixels.join('');
}
