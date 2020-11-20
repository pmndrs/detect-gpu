/**
 * @jest-environment node
 */

import { expectGPUResults, getTier } from './utils';

test(`SSR`, async () => {
  expectGPUResults(
    {
      tier: undefined,
      type: 'SSR',
    },
    await getTier()
  );
});
