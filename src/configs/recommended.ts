/**
 * @file This file contains the "recommended" flavour of ESLint plugin configuration.
 */
import {
  RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION,
  RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION,
} from "../rules";
export = {
  parser: "@typescript-eslint/parser",
  rules: {
    [RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION]: ["error"],
    [RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION]: ["error"],
  },
};
