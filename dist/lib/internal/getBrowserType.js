"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTablet = exports.isMobile = exports.browser = void 0;
// Vendor
const detect_ua_1 = require("detect-ua");
const device = new detect_ua_1.DetectUA();
exports.browser = device.browser, exports.isMobile = device.isMobile, exports.isTablet = device.isTablet;
//# sourceMappingURL=getBrowserType.js.map