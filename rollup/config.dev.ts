import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

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
      verbose: true,
      exts: ['ts', 'html', 'js', 'css'],
      watch: './example/**',
    }),
    typescript(),
    resolve(),
    commonjs(),
    serve({
      open: true,
      openPage: '/',
      host: 'localhost',
      port: 3003,
      contentBase: ['./example'],
    }),
    json(),
    copy({
      targets: [{ src: 'benchmarks', dest: 'example/build' }],
    }),
  ],
};
