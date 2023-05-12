// ESLint config for formatting the <project name>/src/**/*.ts files.
const baseConfig = require("./.eslintrc.cjs");
baseConfig.extends.unshift("plugin:path-import-extension/recommended");
baseConfig.plugins.unshift("path-import-extension");
module.exports = baseConfig;
