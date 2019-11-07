"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated data
const GPUBenchmark_1 = require("./__generated__/GPUBenchmark");
// Internal
const cleanEntryString_1 = require("./internal/cleanEntryString");
const cleanRendererString_1 = require("./internal/cleanRendererString");
const deobfuscateRendererString_1 = require("./internal/deobfuscateRendererString");
const getBenchmarkByPercentage_1 = require("./internal/getBenchmarkByPercentage");
const getBrowserType_1 = require("./internal/getBrowserType");
const getEntryVersionNumber_1 = require("./internal/getEntryVersionNumber");
const getWebGLUnmaskedRenderer_1 = require("./internal/getWebGLUnmaskedRenderer");
const isWebGLSupported_1 = require("./internal/isWebGLSupported");
exports.getGPUTier = (options = {}) => {
    const mobileBenchmarkPercentages = options.mobileBenchmarkPercentages || [
        0,
        50,
        30,
        20,
    ];
    const desktopBenchmarkPercentages = options.desktopBenchmarkPercentages || [
        0,
        50,
        30,
        20,
    ];
    const forceRendererString = options.forceRendererString || '';
    const forceMobile = options.forceMobile || false;
    let gl;
    let rendererString;
    let tier = '';
    let type = '';
    if (!forceRendererString) {
        gl =
            options.glContext ||
                isWebGLSupported_1.isWebGLSupported({
                    browser: getBrowserType_1.browser,
                });
        if (!gl) {
            if (getBrowserType_1.isMobile || getBrowserType_1.isTablet || forceMobile) {
                return {
                    tier: 'GPU_MOBILE_TIER_0',
                    type: 'WEBGL_UNSUPPORTED',
                };
            }
            return {
                tier: 'GPU_DESKTOP_TIER_0',
                type: 'WEBGL_UNSUPPORTED',
            };
        }
        rendererString = getWebGLUnmaskedRenderer_1.getWebGLUnmaskedRenderer(gl);
    }
    else {
        rendererString = forceRendererString;
    }
    rendererString = cleanRendererString_1.cleanRendererString(rendererString);
    if (gl) {
        rendererString = deobfuscateRendererString_1.deobfuscateRendererString({
            gl,
            rendererString,
        });
    }
    const rendererVersionNumber = rendererString.replace(/[\D]/g, '');
    // GPU BLACKLIST
    // https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
    // https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
    // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/software_rendering_list.json
    // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/gpu_driver_bug_list.json
    const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon hd 2600|mali-4|mali-3|mali-2|google swiftshader)/.test(rendererString);
    if (isGPUBlacklisted) {
        if (getBrowserType_1.isMobile || getBrowserType_1.isTablet || forceMobile) {
            return {
                tier: 'GPU_MOBILE_TIER_0',
                type: 'BLACKLISTED',
            };
        }
        return {
            tier: 'GPU_DESKTOP_TIER_0',
            type: 'BLACKLISTED',
        };
    }
    if (getBrowserType_1.isMobile || getBrowserType_1.isTablet || forceMobile) {
        const mobileBenchmark = getBenchmarkByPercentage_1.getBenchmarkByPercentage(GPUBenchmark_1.GPU_BENCHMARK_SCORE_MOBILE, mobileBenchmarkPercentages);
        const isRendererAdreno = rendererString.includes('adreno');
        const isRendererApple = rendererString.includes('apple');
        const isRendererMali = rendererString.includes('mali') && !rendererString.includes('mali-t');
        const isRendererMaliT = rendererString.includes('mali-t');
        const isRendererNVIDIA = rendererString.includes('nvidia');
        const isRendererPowerVR = rendererString.includes('powervr');
        mobileBenchmark.forEach((benchmarkTier, index) => benchmarkTier.forEach(benchmarkEntry => {
            const entry = cleanEntryString_1.cleanEntryString(benchmarkEntry);
            const entryVersionNumber = getEntryVersionNumber_1.getEntryVersionNumber(entry);
            if ((entry.includes('adreno') && isRendererAdreno) ||
                (entry.includes('apple') && isRendererApple) ||
                (entry.includes('mali') && !entry.includes('mali-t') && isRendererMali) ||
                (entry.includes('mali-t') && isRendererMaliT) ||
                (entry.includes('nvidia') && isRendererNVIDIA) ||
                (entry.includes('powervr') && isRendererPowerVR)) {
                if (entryVersionNumber.includes(rendererVersionNumber)) {
                    tier = `GPU_MOBILE_TIER_${index}`;
                    type = `BENCHMARK - ${entry}`;
                }
                // Handle mobile edge cases
            }
        }));
        if (!tier) {
            tier = 'GPU_MOBILE_TIER_1';
            type = 'FALLBACK';
        }
        return {
            tier,
            type,
        };
    }
    if (getBrowserType_1.isDesktop) {
        const desktopBenchmark = getBenchmarkByPercentage_1.getBenchmarkByPercentage(GPUBenchmark_1.GPU_BENCHMARK_SCORE_DESKTOP, desktopBenchmarkPercentages);
        const isRendererIntel = rendererString.includes('intel');
        const isRendererAMD = rendererString.includes('amd');
        const isRendererNVIDIA = rendererString.includes('nvidia');
        desktopBenchmark.forEach((benchmarkTier, index) => benchmarkTier.forEach(benchmarkEntry => {
            const entry = cleanEntryString_1.cleanEntryString(benchmarkEntry);
            const entryVersionNumber = getEntryVersionNumber_1.getEntryVersionNumber(entry);
            if ((entry.includes('intel') && isRendererIntel) ||
                (entry.includes('amd') && isRendererAMD) ||
                (entry.includes('nvidia') && isRendererNVIDIA)) {
                if (entryVersionNumber.includes(rendererVersionNumber)) {
                    tier = `GPU_DESKTOP_TIER_${index}`;
                    type = `BENCHMARK - ${entry}`;
                }
                // Handle desktop edge cases
            }
        }));
        if (!tier) {
            tier = 'GPU_DESKTOP_TIER_1';
            type = 'FALLBACK';
        }
        return {
            tier,
            type,
        };
    }
    return {
        tier,
        type,
    };
};
//# sourceMappingURL=index.js.map