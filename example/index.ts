// Application
import { getGPUTier } from '../src';

(async () => {
  const data = await getGPUTier({
    benchmarksURL: '/build/benchmarks',
  });

  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
