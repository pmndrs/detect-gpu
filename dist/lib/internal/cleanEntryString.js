"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanEntryString = void 0;
exports.cleanEntryString = (entryString) => entryString
    .toLowerCase() // Lowercase all for easier matching
    .split('- ')[1] // Remove prelude score (`3 - `)
    .split(' /')[0]; // Reduce 'apple a9x / powervr series 7xt' to 'apple a9x'
//# sourceMappingURL=cleanEntryString.js.map