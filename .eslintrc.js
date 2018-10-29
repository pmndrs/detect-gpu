// @ts-check

module.exports = {
  extends: 'airbnb-base',
  rules: {
    'import/prefer-default-export': 0,
    'no-bitwise': 0,
    'no-underscore-dangle': 0,
  },
  globals: {
    test: true,
    expect: true,
    window: true,
    self: true,
    navigator: true,
    document: true,
    WebGLRenderingContext: true,
  },
};
