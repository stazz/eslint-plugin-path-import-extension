/**
 * @file This file contains the "recommended" flavour of ESLint plugin configuration.
 */
export = {
  parser: "@typescript-eslint/parser",
  rules: {
    "require-relative-import-extension": ["error"],
    "require-relative-export-extension": ["error"],
  },
};
