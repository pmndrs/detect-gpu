// Application
import { getGPUTier } from '../src';

// Data
import benchmarks from '../benchmarks/all.json';

(async () => {
  const data = await getGPUTier({
    // benchmarksURL: '/build/benchmarks',
    override: {
      loadBenchmarks: async (file: string) => await (benchmarks as any)[file],
    },
  });

  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
