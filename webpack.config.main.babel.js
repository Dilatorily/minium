import { join } from 'path';
import webpack from 'webpack';

const isDevelopment = process.env.NODE_ENV === 'development';
const rendererPort = parseInt(process.env.RENDERER_PORT, 10) || 8080;
const serverPort = parseInt(process.env.SERVER_PORT, 10) || 8081;

const basePlugins = [];
const developmentPlugins = [
  new webpack.DefinePlugin({
    'process.env.RENDERER_PORT': JSON.stringify(rendererPort),
    'process.env.SERVER_PORT': JSON.stringify(serverPort),
  }),
];
const productionPlugins = [];
const plugins = [...basePlugins, ...(isDevelopment ? developmentPlugins : productionPlugins)];

export default {
  entry: ['./src/main'],
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: join(__dirname, 'build'),
    filename: 'index.js',
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
                bugfixes: true,
                corejs: 3,
                modules: false,
                targets: 'node 12',
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
      },
    ],
  },
  plugins,
  resolve: { extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'] },
  devtool: isDevelopment ? 'eval-source-map' : false,
  target: 'electron-main',
};
