// Vendor
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { RollupOptions, ModuleFormat } from 'rollup';
import copy from 'rollup-plugin-copy';

const formats: ModuleFormat[] = ['esm', 'umd'];

export default formats.map(
  (format): RollupOptions => ({
    input: './src/index.ts',
    output: {
      name: 'DetectGPU',
      file: `./dist/detect-gpu.${format}.js`,
      format,
    },
    plugins: [
      terser({
        format: {
          comments: false,
        },
      }),
      filesize(),
      typescript(
        ['esm'].includes(format)
          ? {}
          : {
              tsconfigOverride: {
                compilerOptions: {
                  target: 'es6',
                  module: 'es2015',
                },
              },
            }
      ),
      resolve(),
      commonjs(),
      copy({
        targets: [{ src: 'benchmarks', dest: 'dist' }],
      }),
    ],
  })
);
