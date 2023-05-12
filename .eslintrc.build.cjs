// ESLint config for formatting the <project name>/src/**/*.ts files.
const baseConfig = require("./.eslintrc.cjs");
baseConfig.extends.unshift("plugin:path-import-extension/recommended");
baseConfig.plugins.unshift("path-import-extension");
baseConfig.overrides = [
    {
      files: ["**/__test__/*.ts"],
      rules: {
        "path-import-extension/require-path-export-extension": "off",
        "path-import-extension/require-path-import-extension": "off"
      }
    }
  ];
module.exports = baseConfig;
