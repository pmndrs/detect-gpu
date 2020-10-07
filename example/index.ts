// Application
import { getGPUTier } from '../src';

(async (): Promise<void> => {
  const data = await getGPUTier({
    override: {
      renderer: 'radeon hd 4870',
    },
    benchmarksURL: '/build/benchmarks',
    debug: true,
  });

  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
