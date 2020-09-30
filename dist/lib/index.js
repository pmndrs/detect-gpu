"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGPUTier = void 0;
const cleanRendererString_1 = require("./internal/cleanRendererString");
const getEntryVersionNumber_1 = require("./internal/getEntryVersionNumber");
const getWebGLUnmaskedRenderer_1 = require("./internal/getWebGLUnmaskedRenderer");
const getLevenshteinDistance_1 = require("./internal/getLevenshteinDistance");
const getSupportedWebGLContext_1 = require("./internal/getSupportedWebGLContext");
const device_1 = require("./internal/device");
const debug = false ? console.log : undefined;
exports.getGPUTier = async ({ mobilePercentiles = [0, 50, 30, 20], desktopPercentiles = [0, 50, 30, 20], renderer, mobile = !!device_1.device.mobile, glContext, failIfMajorPerformanceCaveat = true, } = {}) => {
    const toResult = (tier, type, model) => ({
        tier,
        mobile,
        type,
        model,
    });
    if (!renderer) {
        const gl = glContext ||
            getSupportedWebGLContext_1.getSupportedWebGLContext(device_1.device.safari12, failIfMajorPerformanceCaveat);
        if (!gl) {
            return toResult(0, 'WEBGL_UNSUPPORTED');
        }
        renderer = getWebGLUnmaskedRenderer_1.getWebGLUnmaskedRenderer(gl);
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
    renderer = cleanRendererString_1.cleanRendererString(renderer);
    const imports = mobile
        ? {
            adreno: () => Promise.resolve().then(() => __importStar(require('./data/m-adreno.json'))),
            apple: () => Promise.resolve().then(() => __importStar(require('./data/m-apple.json'))),
            'mali-t': () => Promise.resolve().then(() => __importStar(require('./data/m-mali-t.json'))),
            mali: () => Promise.resolve().then(() => __importStar(require('./data/m-mali.json'))),
            nvidia: () => Promise.resolve().then(() => __importStar(require('./data/m-nvidia.json'))),
            powervr: () => Promise.resolve().then(() => __importStar(require('./data/m-powervr.json'))),
        }
        : {
            intel: () => Promise.resolve().then(() => __importStar(require('./data/d-intel.json'))),
            amd: () => Promise.resolve().then(() => __importStar(require('./data/d-amd.json'))),
            radeon: () => Promise.resolve().then(() => __importStar(require('./data/d-radeon.json'))),
            nvidia: () => Promise.resolve().then(() => __importStar(require('./data/d-nvidia.json'))),
            geforce: () => Promise.resolve().then(() => __importStar(require('./data/d-geforce.json'))),
        };
    const type = Object.keys(imports).find((type) => renderer.includes(type));
    debug && debug({ renderer, mobile, type });
    if (!type)
        return [];
    // @ts-ignore
    const importer = imports[type];
    if (!importer)
        return [];
    const data = (await importer()).default;
    const version = getEntryVersionNumber_1.getEntryVersionNumber(renderer);
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
    debug && debug({ renderer, version, matched });
    if (count === 0)
        return [];
    const [model, , percentile, blacklisted] = count > 1
        ? matched
            .map((match) => [
            match,
            getLevenshteinDistance_1.getLevenshteinDistance(renderer, match[MODEL_INDEX]),
        ])
            .sort(([, a], [, b]) => a - b)[0][MODEL_INDEX]
        : matched[0];
    return [blacklisted ? -1 : percentile, model];
};
//# sourceMappingURL=index.js.map