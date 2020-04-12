import { join } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT, 10) || 8081;

const basePlugins = [new webpack.EnvironmentPlugin(['NODE_ENV'])];
const developmentPlugins = [
  new HtmlWebpackPlugin({ template: 'src/server/index.html' }),
  new webpack.HotModuleReplacementPlugin(),
];
const productionPlugins = [];
const plugins = [...basePlugins, ...(isDevelopment ? developmentPlugins : productionPlugins)];

export default {
  entry: ['./src/server'],
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: join(__dirname, 'build'),
    filename: 'server.js',
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
                targets: isDevelopment ? 'last 1 electron version' : 'node 12',
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
      },
      { test: /\.node$/, loader: 'node-loader' },
    ],
  },
  plugins,
  resolve: {
    ...(isDevelopment ? { mainFields: ['main', 'browser'] } : {}),
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    compress: true,
    hot: true,
    https: true,
    port,
  },
  devtool: isDevelopment ? 'source-map' : false,
  target: isDevelopment ? 'electron-renderer' : 'electron-main',
};
