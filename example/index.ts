// Application
import { getGPUTier } from '../src';

(async (): Promise<void> => {
  const data = await getGPUTier({
    // override: {
    //   renderer: 'intel mesa dri intel hd',
    // },
    benchmarksURL: '/build/benchmarks',
    debug: true,
  });

  document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
})();
