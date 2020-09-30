"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedWebGLContext = void 0;
exports.getSupportedWebGLContext = (isSafari12, failIfMajorPerformanceCaveat = true) => {
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
//# sourceMappingURL=getSupportedWebGLContext.js.map