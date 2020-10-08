const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/ban-ts-ignore': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-explicit-any': WARN,
    'sort-keys': [
      ERROR,
      'asc',
      {
        caseSensitive: true,
        natural: false,
      },
    ],
  },
};
