import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  entry: ['./src/index'],
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: path.join(__dirname, 'build'),
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
              { corejs: 3, modules: false, targets: { node: true }, useBuiltIns: 'entry' },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
      },
    ],
  },
  resolve: { extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'] },
  devtool: isDevelopment ? 'eval-source-map' : false,
  target: 'node',
};
