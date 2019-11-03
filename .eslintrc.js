module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'prettier/react',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
  ],
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['src/**/*.ts?(x)'],
      extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/react',
        'plugin:jest/recommended',
        'plugin:testing-library/react',
      ],
      rules: {
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      },
    },
  ],
};
