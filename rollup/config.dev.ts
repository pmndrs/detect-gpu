// Vendor
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
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
  ],
};
