// Application
import { getGPUTier } from '../src';

(async (): Promise<void> => {
  const data = await getGPUTier({
    benchmarksURL: '/build/benchmarks',
  });

  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
