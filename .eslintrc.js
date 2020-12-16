module.exports = {
  extends: ['eslint:recommended', 
  'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2019
  },
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    'prefer-const': 2,
    'no-var': 2,
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true }
    ],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'class-methods-use-this': 0,
    'object-curly-spacing': [2, 'always'],
    semi: 2,
    'no-restricted-syntax': 0,
    'prettier/prettier': 'error',
    'quote-props': ['error', 'as-needed'],
    'require-atomic-updates': 0
  }
};
