// Vendor
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'example/index.ts',
  output: [
    {
      dir: `./example/build`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    livereload({
      exts: ['ts', 'html', 'js', 'css'],
      verbose: true,
      watch: './example/**',
    }),
    typescript(),
    resolve(),
    commonjs(),
    serve({
      contentBase: ['./example'],
      host: 'localhost',
      open: true,
      openPage: '/',
      port: 3003,
    }),
    copy({
      targets: [{ dest: 'example/build', src: 'benchmarks' }],
    }),
    json(),
    sourcemaps(),
  ],
};
