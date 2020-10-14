// Vendor
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default {
  input: 'example/index.ts',
  output: [
    {
      dir: `./example/build`,
      format: 'esm',
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
  ],
};
