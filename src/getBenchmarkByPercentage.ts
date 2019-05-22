// Get benchmark entry's by percentage of the total benchmark entries
export const getBenchmarkByPercentage = (
  benchmark: string[],
  percentages: number[]
): string[][] => {
  let chunkOffset = 0;

  const benchmarkTiers = percentages.map(percentage => {
    const chunkSize = Math.round((benchmark.length / 100) * percentage);
    const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);

    chunkOffset += chunkSize;

    return chunk;
  });

  return benchmarkTiers;
};
