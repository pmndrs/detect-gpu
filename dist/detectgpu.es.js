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

const device = (() => {
    if (typeof window === 'undefined')
        return {};
    const { userAgent, platform, maxTouchPoints } = window.navigator;
    const isIOS = /(iphone|ipod|ipad)/i.test(userAgent);
    // Workaround for ipadOS, force detection as tablet
    // SEE: https://github.com/lancedikson/bowser/issues/329
    // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    const isIPad = platform === 'MacIntel' &&
        maxTouchPoints > 0 &&
        !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    return {
        mobile: isAndroid || isIOS || isIPad,
        safari12: /Version\/12.+Safari/.test(userAgent)
    };
})();

const deobfuscateRenderer = (gl, renderer, isMobileTier) => __awaiter(void 0, void 0, void 0, function* () {
    // if (renderer === 'apple gpu') {
    //   const { deobfuscate } = await import('./deobfuscateAppleGpu');
    //   renderer = deobfuscate(gl, renderer, isMobileTier);
    // }
    return renderer;
});

const getGPUTier = ({ mobileTiers = [0, 30, 60], desktopTiers = [0, 30, 60], renderer, mobile = !!device.mobile, glContext, failIfMajorPerformanceCaveat = true, screen = typeof window === 'undefined'
    ? { width: 1920, height: 1080 }
    : window.screen, benchmarksUrl = '/benchmarks', loadBenchmarks, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const toResult = (tier, type, model, fps) => ({
        tier,
        mobile,
        type,
        model,
        fps,
    });
    const fallback = toResult(1, 'FALLBACK');
    if (!renderer) {
        const gl = glContext ||
            getSupportedWebGLContext(device.safari12, failIfMajorPerformanceCaveat);
        if (!gl)
            return toResult(0, 'WEBGL_UNSUPPORTED');
        const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugRendererInfo) {
            renderer = gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL);
        }
        if (!renderer)
            return fallback;
        renderer = yield deobfuscateRenderer(gl, renderer);
    }
    const [fps, model] = yield queryBenchmarks(benchmarksUrl, loadBenchmarks, renderer, mobile, screen);
    if (fps === undefined) {
        return fallback;
    }
    else if (fps === -1) {
        return toResult(0, 'BLACKLISTED');
    }
    const tiers = mobile ? mobileTiers : desktopTiers;
    let tier = 0;
    for (let i = 0; i < tiers.length; i++) {
        if (fps >= tiers[i]) {
            tier = i;
        }
    }
    return toResult(tier, 'BENCHMARK', model, fps);
});
const MODEL_INDEX = 0;
const queryBenchmarks = (benchmarksUrl, loadBenchmarks = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch(`${benchmarksUrl}/${file}`).then((res) => res.json());
        return data;
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}), renderer, mobile, screen) => __awaiter(void 0, void 0, void 0, function* () {
    renderer = renderer
        .toLowerCase()
        // Strip off ANGLE() - for example:
        // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
        .replace(/angle \((.+)\)*$/, '$1')
        // Strip off [number]gb & strip off direct3d and after - for example:
        // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
        // 'Radeon (TM) RX 470 Series'
        .replace(/\s+([0-9]+gb|direct3d.+$)|\(r\)| \([^\)]+\)$/g, '');
    const types = mobile
        ? ['adreno', 'apple', 'mali-t', 'mali', 'nvidia', 'powervr']
        : ['intel', 'amd', 'radeon', 'nvidia', 'geforce'];
    let type;
    for (let i = 0; i < types.length; i++) {
        const typesType = types[i];
        if (renderer.indexOf(typesType) > -1) {
            type = typesType;
            break;
        }
    }
    if (!type)
        return [];
    const benchmarkFile = `${mobile ? 'm' : 'd'}-${type}.json`;
    const benchmarks = yield loadBenchmarks(benchmarkFile);
    if (!benchmarks)
        return [];
    const version = getGPUVersion(renderer);
    let matched = benchmarks.filter(([, modelVersion]) => modelVersion === version);
    // If nothing matched, try comparing model names:
    if (!matched.length) {
        matched = benchmarks.filter(([model]) => model.indexOf(renderer) > -1);
    }
    const count = matched.length;
    if (count === 0)
        return [];
    const [model, , blacklisted, fpsesByScreenSize] = count > 1
        ? matched
            .map((match) => [match, leven_1(renderer, match[MODEL_INDEX])])
            .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
        : matched[0];
    let closestFps = 0;
    let minDistance = Number.MAX_VALUE;
    const screenSize = screen.width * screen.height;
    for (let i = 0; i < fpsesByScreenSize.length; i++) {
        let [width, height, fps] = fpsesByScreenSize[i];
        const entryScreenSize = width * height;
        const distance = Math.abs(screenSize - entryScreenSize);
        if (distance < minDistance) {
            minDistance = distance;
            closestFps = fps;
        }
    }
    return [blacklisted ? -1 : closestFps, model];
});

export { getGPUTier };
