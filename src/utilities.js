export function getWebGLContext(attributes) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

  if (!gl || !(gl instanceof WebGLRenderingContext)) {
    return false;
  }

  return gl;
}

// Get benchmark entry's by percentage of the total benchmark entries
export function getBenchmarkByPercentage(benchmark, percentages) {
  let chunkOffset = 0;

  const benchmarkTiers = percentages.map((percentage) => {
    const chunkSize = Math.round((benchmark.length / 100) * percentage);
    const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);

    chunkOffset += chunkSize;

    return chunk;
  });

  return benchmarkTiers;
}
