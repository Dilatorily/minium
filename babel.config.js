module.exports = (api) => {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', { targets: { node: true } }]],
    plugins: [['@babel/plugin-proposal-class-properties', { loose: false }]],
  };
};
