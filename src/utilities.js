export function isWebGLSupported(attributes) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof window.WebGLRenderingContext)) {
    return false;
  }

  return gl;
}

// Higher or equal than a certain version number
export function matchHigherNumericVersion(entry, version) {
  return parseInt(entry.slice().replace(/[\D]/g, ''), 10) >= version;
}

// Lower or equal to a certain version number
export function matchLowerNumericVersion(entry, version) {
  return parseInt(entry.slice().replace(/[\D]/g, ''), 10) <= version;
}

// Check if the entry has a version number between a certain range (low - high)
export function matchNumericRange(entry, higherVersion, lowerVersion) {
  return (
    matchHigherNumericVersion(entry, higherVersion) && matchLowerNumericVersion(entry, lowerVersion)
  );
}

// Get benchmark entry's by percentage of the total benchmark entries
// This is used for effectively future-proofing new GPU's
export function getBenchmarkByPercentage(benchmark, percentages) {
  let chunkOffset = 0;

  const BENCHMARK_TIERS = percentages.map((percentage) => {
    const chunkSize = Math.round((benchmark.length / 100) * percentage);
    const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);

    chunkOffset += chunkSize;

    return chunk;
  });

  return BENCHMARK_TIERS;
}
