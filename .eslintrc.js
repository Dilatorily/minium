module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:import/typescript', 'plugin:prettier/recommended', 'prettier/react'],
  env: {
    jest: true,
  },
  overrides: [
    {
      files: ['src/**/*.ts?(x)'],
      extends: [
        'airbnb',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/react',
      ],
      rules: {
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      },
    },
  ],
};
