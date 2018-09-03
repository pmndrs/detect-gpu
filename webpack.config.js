// Vendor
const path = require('path');

// Paths
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

// Environment
const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  context: srcPath,
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : '',
  entry: './index.js',
  output: {
    path: distPath,
    filename: !isDevelopment ? 'detect-gpu.min.js' : 'detect-gpu.js',
    library: 'DetectGPU',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        options: {
          plugins: ['transform-object-assign'],
          presets: [
            [
              'babel-preset-env',
              {
                modules: false,
                useBuiltIns: false,
                targets: {
                  browsers: ['> 5%', 'last 2 versions', 'not ie < 11'],
                },
              },
            ],
          ],
        },
      },
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
  },

  stats: {
    colors: true,
    children: false,
  },
};

module.exports = config;
