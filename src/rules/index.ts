/**
 * @file This file exports all the rules for this ESLint plugin.
 */
import requireRelativeExportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_RELATIVE_EXPORT_EXTENSION_IMPORTED,
} from "./requirePathExportExtension";
import requireRelativeImportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_RELATIVE_IMPORT_EXTENSION_IMPORTED,
} from "./requirePathImportExtension";

export const RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION =
  RULE_NAME_REQUIRE_RELATIVE_EXPORT_EXTENSION_IMPORTED;
export const RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION =
  RULE_NAME_REQUIRE_RELATIVE_IMPORT_EXTENSION_IMPORTED;

export default {
  [RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION]: requireRelativeExportExtension,
  [RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION]: requireRelativeImportExtension,
};
