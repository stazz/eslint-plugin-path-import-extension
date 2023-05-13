// ESLint config for formatting the resulting .[m]js files (<project name>/dist-(cjs|mjs)/**/*.[m]js) that end up in NPM package.
// Notice that we load this plugin itself into ESLint during the process!
module.exports = {
  root: true,
  extends: [
    // Reference to this ESLint plugin!
    "plugin:path-import-extension/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: [
    // Reference to this ESLint plugin!
    "path-import-extension",
    "prettier"
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    "prettier/prettier": "error",
  }
};
