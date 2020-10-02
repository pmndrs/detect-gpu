// Vendor
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const input = './src/index.ts';
const name = 'DetectGPU';

// tslint:disable-next-line:typedef
const plugins = ({ isUMD = false, isCJS = false, isES = false }) => [
  typescript(),
  resolve(),
  commonjs(),
  !isES && terser(),
  !isES && filesize(),
  json(),
];

export default [
  {
    input,
    output: [
      {
        dir: './dist/esm',
        format: 'esm',
      },
    ],
    plugins: plugins({ isES: true }),
    watch: {
      include: 'src/**',
    },
  },
  {
    input,
    output: [
      {
        dir: './dist/cjs',
        format: 'cjs',
      },
    ],
    plugins: plugins({ isCJS: true }),
    watch: {
      include: 'src/**',
    },
  },
  {
    input,
    output: [
      {
        dir: './dist/es',
        format: 'es',
        name,
      },
    ],
    plugins: plugins({ isES: true }),
    watch: {
      include: 'src/**',
    },
  },
];
