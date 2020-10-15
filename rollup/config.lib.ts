// Vendor
import { ModuleFormat, RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const formats: ModuleFormat[] = ['esm', 'umd'];

export default formats.map(
  (format): RollupOptions => ({
    input: './src/index.ts',
    output: {
      file: `./dist/detect-gpu.${format}.js`,
      format,
      name: 'DetectGPU',
      sourcemap: true,
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
                  target: 'es5',
                },
              },
            }
      ),
      resolve(),
      commonjs(),
      copy({
        targets: [{ dest: 'dist', src: 'benchmarks' }],
      }),
      json(),
      sourcemaps(),
    ],
  })
);
