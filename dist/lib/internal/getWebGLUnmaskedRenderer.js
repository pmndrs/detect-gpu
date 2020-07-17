"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebGLUnmaskedRenderer = void 0;
exports.getWebGLUnmaskedRenderer = (gl) => {
    const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = glExtensionDebugRendererInfo &&
        gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);
    return renderer;
};
//# sourceMappingURL=getWebGLUnmaskedRenderer.js.map