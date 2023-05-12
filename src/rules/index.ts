/**
 * @file This file exports all the rules for this ESLint plugin.
 */
import requirePathExportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION_IMPORTED,
} from "./requirePathExportExtension.js";
import requirePathImportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION_IMPORTED,
} from "./requirePathImportExtension.js";

export const RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION =
  RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION_IMPORTED;
export const RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION =
  RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION_IMPORTED;

export default {
  [RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION]: requirePathExportExtension,
  [RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION]: requirePathImportExtension,
};
