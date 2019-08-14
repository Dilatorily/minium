module.exports = (api) => {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', { targets: { node: true } }], '@babel/preset-typescript'],
    plugins: [['@babel/plugin-proposal-class-properties', { loose: false }]],
  };
};
