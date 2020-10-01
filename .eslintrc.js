module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    semi: ['error', 'never'],
    'import/extensions': [
      'error',
      'always',
      { js: 'never', ts: 'never', mjs: 'never' },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js', '.json'],
      },
    },
  },
}
