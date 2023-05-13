// ESLint config for formatting the resulting .d.ts files (<project name>/dist-ts/**/*.d.ts) that end up in NPM package for typing information.
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.out.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["dist-ts"],
        extensions: [".ts"] // Add .tsx, .js, .jsx if needed
      }
    }
  }
};
