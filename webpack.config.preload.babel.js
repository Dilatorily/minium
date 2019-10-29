import { join } from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  entry: ['./src/preload'],
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: join(__dirname, 'build'),
    filename: 'preload.js',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: 3,
                modules: false,
                targets: 'last 1 electron version',
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',
          ],
        },
      },
      { test: /\.node$/, loader: 'node-loader' },
    ],
  },
  resolve: { extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'] },
  devtool: isDevelopment ? 'source-map' : false,
  target: 'electron-preload',
};
