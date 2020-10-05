import { getGPUTier } from '../src';

(async () => {
  const data = await getGPUTier({
    benchmarksUrl: '/build/benchmarks',
  });
  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
