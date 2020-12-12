module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  env: {
    es2021: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'standard',
    'prettier',
    'plugin:prettier/recommended',
    'prettier/standard',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
}
