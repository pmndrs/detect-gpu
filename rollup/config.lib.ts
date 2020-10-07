// Vendor
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { RollupOptions, ModuleFormat } from 'rollup';

const formats: ModuleFormat[] = ['esm', 'umd'];

export default formats.map(
  (format): RollupOptions => ({
    input: './src/index.ts',
    output: {
      file: `./dist/detect-gpu.${format}.js`,
      format,
      name: 'DetectGPU',
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
                  module: 'es2015',
                  target: 'es6',
                },
              },
            }
      ),
      resolve(),
      commonjs(),
    ],
  })
);
