/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const array = [];
const charCodeCache = [];

const leven = (left, right) => {
	if (left === right) {
		return 0;
	}

	const swap = left;

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if (left.length > right.length) {
		left = right;
		right = swap;
	}

	let leftLength = left.length;
	let rightLength = right.length;

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	// Note: `~-` is the bitwise way to perform a `- 1` operation
	while (leftLength > 0 && (left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength))) {
		leftLength--;
		rightLength--;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	let start = 0;

	while (start < leftLength && (left.charCodeAt(start) === right.charCodeAt(start))) {
		start++;
	}

	leftLength -= start;
	rightLength -= start;

	if (leftLength === 0) {
		return rightLength;
	}

	let bCharCode;
	let result;
	let temp;
	let temp2;
	let i = 0;
	let j = 0;

	while (i < leftLength) {
		charCodeCache[i] = left.charCodeAt(start + i);
		array[i] = ++i;
	}

	while (j < rightLength) {
		bCharCode = right.charCodeAt(start + j);
		temp = j++;
		result = j;

		for (i = 0; i < leftLength; i++) {
			temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
			temp = array[i];
			// eslint-disable-next-line no-multi-assign
			result = array[i] = temp > result ? temp2 > result ? result + 1 : temp2 : temp2 > temp ? temp + 1 : temp2;
		}
	}

	return result;
};

var leven_1 = leven;
// TODO: Remove this for the next major release
var default_1 = leven;
leven_1.default = default_1;

function fetch(e,n){return n=n||{},new Promise(function(t,r){var s=new XMLHttpRequest,o=[],u=[],i={},a=function(){return {ok:2==(s.status/100|0),statusText:s.statusText,status:s.status,url:s.responseURL,text:function(){return Promise.resolve(s.responseText)},json:function(){return Promise.resolve(s.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([s.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var l in s.open(n.method||"get",e,!0),s.onload=function(){s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t;}),t(a());},s.onerror=r,s.withCredentials="include"==n.credentials,n.headers)s.setRequestHeader(l,n.headers[l]);s.send(n.body||null);})}

const getGPUVersion = (model) => {
    var _a;
    model = model.replace(/\([^\)]+\)/, '');
    const matches = 
    // First set of digits
    model.match(/[\d]+/) ||
        // If the renderer did not contain any numbers, match letters
        model.match(/(\W|^)([a-zA-Z]{1,3})(\W|$)/g);
    // Remove any non word characters and also remove 'amd' which could be matched
    // in the clause above
    return (_a = matches === null || matches === void 0 ? void 0 : matches.join('').replace(/\W|amd/g, '')) !== null && _a !== void 0 ? _a : '';
};

const getSupportedWebGLContext = (isSafari12, failIfMajorPerformanceCaveat = true) => {
    const attributes = {
        alpha: false,
        antialias: false,
        depth: false,
        failIfMajorPerformanceCaveat,
        powerPreference: 'high-performance',
        stencil: false,
    };
    // Workaround for Safari 12, which otherwise crashes with powerPreference set
    // to high-performance: https://github.com/TimvanScherpenzeel/detect-gpu/issues/5
    if (isSafari12) {
        delete attributes.powerPreference;
    }
    // Keep reference to the canvas and context in order to clean up
    // after the necessary information has been extracted
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl', attributes) ||
        canvas.getContext('experimental-webgl', attributes));
    return gl || undefined;
};

const deviceInfo = (() => {
    if (typeof window === 'undefined') {
        return {};
    }
    const { userAgent, platform, maxTouchPoints } = window.navigator;
    const isIOS = /(iphone|ipod|ipad)/i.test(userAgent);
    // Workaround for ipadOS, force detection as tablet
    // SEE: https://github.com/lancedikson/bowser/issues/329
    // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    const isIpad = platform === 'iPad' ||
        (platform === 'MacIntel' && maxTouchPoints > 0 && !window.MSStream);
    const isAndroid = /android/i.test(userAgent);
    return {
        isMobile: isAndroid || isIOS || isIpad,
        isSafari12: /Version\/12.+Safari/.test(userAgent),
        isIpad,
    };
})();

/**
 * The following defined constants and descriptions are directly ported from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 *
 * Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
 *
 * Contributors
 *
 * See: https://developer.mozilla.org/en-US/profiles/Sheppy
 * See: https://developer.mozilla.org/en-US/profiles/fscholz
 * See: https://developer.mozilla.org/en-US/profiles/AtiX
 * See: https://developer.mozilla.org/en-US/profiles/Sebastianz
 *
 * These constants are defined on the WebGLRenderingContext / WebGL2RenderingContext interface
 */
/**
 * Passed to clear to clear the current color buffer
 * @constant {number}
 */
const GL_COLOR_BUFFER_BIT = 0x00004000;
/**
 * Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle
 * @constant {number}
 */
const GL_TRIANGLES = 0x0004;
// Buffers
// Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or WebGLRenderingContext.getBufferParameter()
/**
 * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often
 * @constant {number}
 */
const GL_STATIC_DRAW = 0x88e4;
/**
 * Passed to bindBuffer or bufferData to specify the type of buffer being used
 * @constant {number}
 */
const GL_ARRAY_BUFFER = 0x8892;
/**
 * @constant {number}
 */
const GL_UNSIGNED_BYTE = 0x1401;
/**
 * @constant {number}
 */
const GL_FLOAT = 0x1406;
/**
 * @constant {number}
 */
const GL_RGBA = 0x1908;
// Shaders
// Constants passed to WebGLRenderingContext.getShaderParameter()
/**
 * Passed to createShader to define a fragment shader
 * @constant {number}
 */
const GL_FRAGMENT_SHADER = 0x8b30;
/**
 * Passed to createShader to define a vertex shader
 * @constant {number}
 */
const GL_VERTEX_SHADER = 0x8b31;

// Apple GPU (iOS 12.2+, Safari 14+)
// SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/7
// CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
// CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
const deobfuscateAppleGpu = (gl, renderer, isMobileTier, logging) => {
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
            gl.bufferData(GL_ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), GL_STATIC_DRAW);
            const aPosition = gl.getAttribLocation(program, 'aPosition');
            gl.vertexAttribPointer(aPosition, 3, GL_FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPosition);
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(GL_COLOR_BUFFER_BIT);
            gl.viewport(0, 0, 1, 1);
            gl.drawArrays(GL_TRIANGLES, 0, 3);
            const pixels = new Uint8Array(4);
            gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_UNSIGNED_BYTE, pixels);
            gl.deleteProgram(program);
            gl.deleteBuffer(vertexArray);
            renderers =
                // @ts-ignore
                {
                    // iPhone 11, 11 Pro, 11 Pro Max (Apple A13 GPU)
                    // iPad Pro (Apple A12X GPU)
                    // iPhone XS, XS Max, XR (Apple A12 GPU)
                    // iPhone 8, 8 Plus (Apple A11 GPU)
                    '801621810': deviceInfo.isIpad
                        ? ['apple a12x gpu']
                        : ['apple a11 gpu', 'apple a12 gpu', 'apple a13 gpu'],
                    // iPhone SE, 6S, 6S Plus (Apple A9 GPU)
                    // iPhone 7, 7 Plus (Apple A10 GPU)
                    // iPad Pro (Apple A10X GPU)
                    '8016218135': deviceInfo.isIpad
                        ? ['apple a9x gpu', 'apple a10 gpu', 'apple a10x gpu']
                        : ['apple a9 gpu', 'apple a10 gpu'],
                }[pixels.join('')] || renderers;
            if (logging) {
                console.warn(`iOS 12.2+ obfuscates its GPU type and version, using closest matches: ${renderers}`);
            }
        }
    }
    else {
        if (logging) {
            console.warn('Safari 14+ obfuscates its GPU type and version, using fallback');
        }
    }
    return renderers;
};

// Internal
const deobfuscateRenderer = (gl, renderer, isMobileTier, logging) => renderer === 'apple gpu'
    ? deobfuscateAppleGpu(gl, renderer, isMobileTier, logging)
    : [renderer];

const queryCache = {};
const getGPUTier = ({ mobileTiers = [0, 30, 60], desktopTiers = [0, 30, 60], logging = false, override: { renderer, isIpad = Boolean(deviceInfo.isIpad), isMobile = Boolean(deviceInfo.isMobile), screen = typeof window === 'undefined'
    ? { width: 1920, height: 1080 }
    : window.screen, loadBenchmarks, } = {}, glContext, failIfMajorPerformanceCaveat = true, benchmarksURL = '/benchmarks', } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const MODEL_INDEX = 0;
    const queryBenchmarks = (loadBenchmarks = (file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield fetch(`${benchmarksURL}/${file}`).then((response) => response.json());
            return data;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }), renderer) => __awaiter(void 0, void 0, void 0, function* () {
        if (logging) {
            console.log('queryBenchmarks', { renderer });
        }
        renderer = renderer
            .toLowerCase()
            // Strip off ANGLE() - for example:
            // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
            .replace(/angle \((.+)\)*$/, '$1')
            // Strip off [number]gb & strip off direct3d and after - for example:
            // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
            // 'Radeon (TM) RX 470 Series'
            .replace(/\s+([0-9]+gb|direct3d.+$)|\(r\)| \([^\)]+\)$/g, '');
        if (logging) {
            console.log('queryBenchmarks - renderer cleaned to', { renderer });
        }
        const types = isMobile
            ? ['adreno', 'apple', 'mali-t', 'mali', 'nvidia', 'powervr']
            : ['intel', 'amd', 'radeon', 'nvidia', 'geforce'];
        let type;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < types.length; i++) {
            const typesType = types[i];
            if (renderer.indexOf(typesType) > -1) {
                type = typesType;
                break;
            }
        }
        if (!type) {
            return [];
        }
        if (logging) {
            console.log('queryBenchmarks - found type:', { type });
        }
        const benchmarkFile = `${isMobile ? 'm' : 'd'}-${type}.json`;
        const benchmark = (queryCache[benchmarkFile] = queryCache[benchmarkFile] || loadBenchmarks(benchmarkFile));
        const benchmarks = yield benchmark;
        if (!benchmarks) {
            return [];
        }
        const version = getGPUVersion(renderer);
        const isApple = type === 'apple';
        let matched = benchmarks.filter(([, modelVersion]) => modelVersion === version);
        if (logging) {
            console.log(`found ${matched.length} matching entries using version '${version}':`, matched.map(([model]) => model));
        }
        // If nothing matched, try comparing model names:
        if (!matched.length) {
            matched = benchmarks.filter(([model]) => model.indexOf(renderer) > -1);
            if (logging) {
                console.log(`found ${matched.length} matching entries comparing model names`, {
                    matched,
                });
            }
        }
        const count = matched.length;
        if (count === 0) {
            return [];
        }
        let [gpu, , blacklisted, fpsesByScreenSize] = count > 1
            ? matched
                .map((match) => [match, leven_1(renderer, match[MODEL_INDEX])])
                .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
            : matched[0];
        if (logging) {
            console.log(`${renderer} matched closest to ${gpu} with the following screen sizes`, JSON.stringify(fpsesByScreenSize));
        }
        let minDistance = Number.MAX_VALUE;
        let closest;
        const { devicePixelRatio } = window;
        const screenSize = screen.width * devicePixelRatio * (screen.height * devicePixelRatio);
        if (isApple) {
            fpsesByScreenSize = fpsesByScreenSize.filter(([, , , device]) => device.indexOf(isIpad ? 'ipad' : 'iphone') > -1);
        }
        for (let i = 0; i < fpsesByScreenSize.length; i++) {
            const match = fpsesByScreenSize[i];
            const [width, height] = match;
            const entryScreenSize = width * height;
            const distance = Math.abs(screenSize - entryScreenSize);
            if (distance < minDistance) {
                minDistance = distance;
                closest = match;
            }
        }
        // If blacklisted change fps to -1
        // TODO: move this to update benchmarks script
        const [, , fps, device] = closest;
        return [minDistance, blacklisted ? -1 : fps, gpu, device];
    });
    let renderers;
    const fallback = {
        tier: 1,
        type: 'FALLBACK',
    };
    if (!renderer) {
        const gl = glContext ||
            getSupportedWebGLContext(deviceInfo.isSafari12, failIfMajorPerformanceCaveat);
        if (!gl) {
            return { tier: 0, type: 'WEBGL_UNSUPPORTED' };
        }
        const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugRendererInfo) {
            renderer = gl
                .getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL)
                .toLowerCase();
        }
        if (!renderer) {
            return fallback;
        }
        renderers = deobfuscateRenderer(gl, renderer, isMobile, logging);
    }
    else {
        renderers = [renderer];
    }
    const results = yield Promise.all(renderers.map((renderer) => queryBenchmarks(loadBenchmarks, renderer)));
    const result = results.length === 1
        ? results[0]
        : results.sort(([aDis = Number.MAX_VALUE], [bDis = Number.MAX_VALUE]) => aDis - bDis)[0];
    if (result.length === 0) {
        return fallback;
    }
    const [, fps, model, device] = result;
    if (fps === -1) {
        return { tier: 0, type: 'BLACKLISTED', fps, model, device };
    }
    const tiers = isMobile ? mobileTiers : desktopTiers;
    let tier = 0;
    for (let i = 0; i < tiers.length; i++) {
        if (fps >= tiers[i]) {
            tier = i;
        }
    }
    return { tier, type: 'BENCHMARK', fps, model, device };
});

export { getGPUTier };
