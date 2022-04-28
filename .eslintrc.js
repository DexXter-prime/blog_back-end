module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'no-tabs': 0,
    'class-methods-use-this': 0,
    'func-names': 0,
    'consistent-return': 0,
    'max-len': 0,
  },
};
