export function isWebGLSupported(attributes) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof window.WebGLRenderingContext)) {
    return false;
  }

  return gl;
}

// Get benchmark entry's by percentage of the total benchmark entries
export function getBenchmarkByPercentage(benchmark, percentages) {
  let chunkOffset = 0;
  const reversedBenchmark = benchmark.reverse();

  const benchmarkTiers = percentages.map((percentage) => {
    const chunkSize = Math.round((reversedBenchmark.length / 100) * percentage);
    const chunk = reversedBenchmark.slice(chunkOffset, chunkOffset + chunkSize);

    chunkOffset += chunkSize;

    return chunk;
  });

  return benchmarkTiers;
}
