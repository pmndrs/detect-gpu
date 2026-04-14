import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  minify: true,
  target: 'es2020',
  copy: [{ from: 'benchmarks/*', to: 'dist/benchmarks' }],
});
