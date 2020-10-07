// Vendor
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { RollupOptions, ModuleFormat } from 'rollup';

const formats: ModuleFormat[] = ['esm', 'cjs', 'es', 'amd'];

export default formats.map(
  (format): RollupOptions => ({
    input: './src/index.ts',
    output: {
      name: 'DetectGPU',
      file: `./dist/detectgpu.${format}.js`,
      format,
    },
    plugins: [
      ...(format !== 'es'
        ? [
            terser({
              format: {
                comments: false,
              },
            }),
            filesize(),
          ]
        : []),
      typescript(
        ['es', 'esm'].includes(format)
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
      json(),
    ],
  })
);
