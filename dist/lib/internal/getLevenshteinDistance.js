"use strict";
/**
 * @author keesey
 * https://gist.github.com/keesey/e09d0af833476385b9ee13b6d26a2b84
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevenshteinDistance = void 0;
function getLevenshteinDistance(a, b) {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0)
        return bn;
    if (bn === 0)
        return an;
    const matrix = new Array(bn + 1);
    for (let i = 0; i <= bn; ++i) {
        let row = (matrix[i] = new Array(an + 1));
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
                matrix[i][j] =
                    Math.min(matrix[i - 1][j - 1], // substitution
                    matrix[i][j - 1], // insertion
                    matrix[i - 1][j] // deletion
                    ) + 1;
            }
        }
    }
    return matrix[bn][an];
}
exports.getLevenshteinDistance = getLevenshteinDistance;
//# sourceMappingURL=getLevenshteinDistance.js.map