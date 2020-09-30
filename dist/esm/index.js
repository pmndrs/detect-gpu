const cleanRendererString = (rendererString) => {
    let cleaned = rendererString.toLowerCase();
    // Strip off ANGLE() - for example:
    // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
    cleaned = cleaned.replace(/angle \((.+)\)*$/, '$1');
    // Strip off [number]gb & strip off direct3d and after - for example:
    // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
    // 'Radeon (TM) RX 470 Series'
    cleaned = cleaned.replace(/\s+([0-9]+gb|direct3d.+$)/g, '');
    return cleaned;
};

const getEntryVersionNumber = (entryString) => {
    entryString = entryString.replace(/\([^\)]+\)/, '');
    let matches = entryString.match(/[\d]+/);
    // If the renderer did not contain any numbers, match letters
    if (!matches) {
        matches = entryString.match(/(\W|^)([a-zA-Z]{1,3})(\W|$)/g);
    }
    // Remove any non word characters and also remove 'amd' which could be matched
    // in the clause above
    return matches ? matches.join('').replace(/\W|amd/g, '') : '';
};

const getWebGLUnmaskedRenderer = (gl) => {
    const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return glExtensionDebugRendererInfo
        ? gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
        : undefined;
};

// Compute the difference (distance) between two strings
// SEE: https://en.wikipedia.org/wiki/Levenshtein_distance
// CREDIT: https://gist.github.com/keesey/e09d0af833476385b9ee13b6d26a2b84
const getLevenshteinDistance = (a, b) => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) {
        return bn;
    }
    if (bn === 0) {
        return an;
    }
    const matrix = new Array(bn + 1);
    for (let i = 0; i <= bn; ++i) {
        const row = (matrix[i] = new Array(an + 1));
        row[0] = i;
    }
    const firstRow = matrix[0];
    for (let j = 1; j <= an; ++j) {
        firstRow[j] = j;
    }
    for (let i = 1; i <= bn; ++i) {
        for (let j = 1; j <= an; ++j) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
            }
        }
    }
    return matrix[bn][an];
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
    const gl = canvas.getContext('webgl', attributes) ||
        canvas.getContext('experimental-webgl', attributes);
    return !(gl instanceof WebGLRenderingContext) ? undefined : gl;
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

const getGPUTier = async ({ mobilePercentiles = [0, 50, 30, 20], desktopPercentiles = [0, 50, 30, 20], renderer, mobile = !!device.mobile, glContext, failIfMajorPerformanceCaveat = true, } = {}) => {
    const toResult = (tier, type, model) => ({
        tier,
        mobile,
        type,
        model,
    });
    if (!renderer) {
        const gl = glContext ||
            getSupportedWebGLContext(device.safari12, failIfMajorPerformanceCaveat);
        if (!gl) {
            return toResult(0, 'WEBGL_UNSUPPORTED');
        }
        renderer = getWebGLUnmaskedRenderer(gl);
    }
    const [rank, model] = await getPercentile(renderer, mobile);
    if (rank === undefined) {
        return toResult(1, 'FALLBACK');
    }
    else if (rank === -1) {
        return toResult(0, 'BLACKLISTED');
    }
    let total = 0;
    const tier = (mobile ? mobilePercentiles : desktopPercentiles).findIndex((percentage) => {
        total += percentage;
        return rank <= total;
    });
    return toResult(tier, 'BENCHMARK', model);
};
const MODEL_INDEX = 0;
const VERSION_INDEX = 1;
const getPercentile = async (renderer, mobile) => {
    renderer = cleanRendererString(renderer);
    const imports = mobile
        ? {
            adreno: () => import('./m-adreno-72f5849b.js'),
            apple: () => import('./m-apple-0363aa57.js'),
            'mali-t': () => import('./m-mali-t-a65f9989.js'),
            mali: () => import('./m-mali-09904b45.js'),
            nvidia: () => import('./m-nvidia-4e87b6b5.js'),
            powervr: () => import('./m-powervr-c70f63ec.js'),
        }
        : {
            intel: () => import('./d-intel-a46ea396.js'),
            amd: () => import('./d-amd-7a5e483c.js'),
            radeon: () => import('./d-radeon-cb3fa57e.js'),
            nvidia: () => import('./d-nvidia-2044742d.js'),
            geforce: () => import('./d-geforce-5e5c3ea9.js'),
        };
    const type = Object.keys(imports).find((type) => renderer.includes(type));
    if (!type)
        return [];
    // @ts-ignore
    const importer = imports[type];
    if (!importer)
        return [];
    const data = (await importer()).default;
    const version = getEntryVersionNumber(renderer);
    let matched = [];
    for (let i = 0; i < data.length; i++) {
        const match = data[i];
        if (match[VERSION_INDEX] === version) {
            matched.push(match);
        }
    }
    // If nothing matched, try comparing model names:
    if (!matched.length) {
        matched = data.filter((entry) => entry[MODEL_INDEX].includes(renderer));
    }
    const count = matched.length;
    if (count === 0)
        return [];
    const [model, , percentile, blacklisted] = count > 1
        ? matched
            .map((match) => [
            match,
            getLevenshteinDistance(renderer, match[MODEL_INDEX]),
        ])
            .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
        : matched[0];
    return [blacklisted ? -1 : percentile, model];
};

export { getGPUTier };
