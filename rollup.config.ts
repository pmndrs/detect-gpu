// Vendor
import commonjsPlugin from 'rollup-plugin-commonjs';
import filesizePlugin from 'rollup-plugin-filesize';
import json from '@rollup/plugin-json';
import resolvePlugin from 'rollup-plugin-node-resolve';
import { terser as terserPlugin } from 'rollup-plugin-terser';
import typescriptPlugin from 'rollup-plugin-typescript2';

const input = './src/index.ts';
const name = 'DetectGPU';

// tslint:disable-next-line:typedef
const plugins = ({ isUMD = false, isCJS = false, isES = false }) => [
  resolvePlugin(),
  (isUMD || isCJS) && commonjsPlugin(),
  typescriptPlugin({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true,
  }),
  !isES && terserPlugin(),
  !isES && filesizePlugin(),
  json()
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
