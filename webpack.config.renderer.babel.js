import { join } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT, 10) || 8080;

const basePlugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new HtmlWebpackPlugin({ template: 'src/renderer/index.html' }),
];
const developmentPlugins = [new webpack.HotModuleReplacementPlugin()];
const productionPlugins = [];
const plugins = [...basePlugins, ...(isDevelopment ? developmentPlugins : productionPlugins)];

export default {
  entry: ['./src/renderer'],
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: join(__dirname, 'build'),
    filename: 'renderer.js',
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
          plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
      },
      { test: /\.node$/, loader: 'node-loader' },
    ],
  },
  plugins,
  resolve: { extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'] },
  devServer: {
    compress: true,
    hot: true,
    https: true,
    port,
  },
  devtool: isDevelopment ? 'source-map' : false,
};
