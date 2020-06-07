module.exports = {
    extends: [
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 6,
    },
    env: {
      browser: true,
      node: true,
    },
  };
