import { join } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT, 10) || 3000;

const basePlugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new HtmlWebpackPlugin({
    template: `src/renderer/index.${isDevelopment ? 'development' : 'production'}.html`,
  }),
];
const developmentPlugins = [new webpack.HotModuleReplacementPlugin()];
const productionPlugins = [];
const plugins = [...basePlugins, ...(isDevelopment ? developmentPlugins : productionPlugins)];

export default {
  entry: [isDevelopment ? 'react-hot-loader/patch' : undefined, './src/renderer'].filter(Boolean),
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
                bugfixes: true,
                corejs: 3,
                modules: false,
                targets: 'last 1 electron version',
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            isDevelopment ? 'react-hot-loader/babel' : undefined,
          ].filter(Boolean),
        },
      },
      { test: /\.node$/, loader: 'node-loader' },
    ],
  },
  plugins,
  resolve: {
    ...(isDevelopment ? { alias: { 'react-dom': '@hot-loader/react-dom' } } : {}),
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    compress: true,
    hot: true,
    https: true,
    port,
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
};
