/**
 * @file ESLint plugin entrypoint file, exporting rules and configurations.
 */
import rules from "./rules/index.js";
import configs from "./configs/index.js";
export = {
  rules,
  configs,
};
