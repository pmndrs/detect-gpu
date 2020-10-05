require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS'
  },
  // and other tsconfig.json options as you like
});

module.exports = require('./config.lib.ts');
