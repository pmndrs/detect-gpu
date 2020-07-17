"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBenchmarkByPercentage = void 0;
// Get benchmark entry's by percentage of the total benchmark entries
exports.getBenchmarkByPercentage = (benchmark, percentages) => {
    let chunkOffset = 0;
    const benchmarkTiers = percentages.map((percentage) => {
        const chunkSize = Math.round((benchmark.length / 100) * percentage);
        const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);
        chunkOffset += chunkSize;
        return chunk;
    });
    return benchmarkTiers;
};
//# sourceMappingURL=getBenchmarkByPercentage.js.map