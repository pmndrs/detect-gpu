"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.device = void 0;
exports.device = (() => {
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
//# sourceMappingURL=device.js.map