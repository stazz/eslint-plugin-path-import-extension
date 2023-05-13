/**
 * @file This file contains rule definition for "require-path-export-extension".
 */
import * as ruleHelpers from "../../rule-helpers";

export const RULE_NAME = ruleHelpers.getRuleName(import.meta.url);
export const MESSAGE_MISSING_EXTENSION = "message-export-missing-extension";
export default ruleHelpers.createRule({
  name: RULE_NAME,
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Enforce extension to path-based exports.",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      [MESSAGE_MISSING_EXTENSION]: "Path-based export does not have extension.",
    },
  },
  create: (ctx, options) => {
    const { checkAlsoType, ...opts } = options;
    const checkLiteralNode = ruleHelpers.createLiteralNodeCheck(
      ctx,
      MESSAGE_MISSING_EXTENSION,
      opts,
    );
    return {
      // ExportAllDeclaration: export * from "./something"
      ExportAllDeclaration: ({ source, exportKind }) => {
        if (checkAlsoType || exportKind !== "type") {
          checkLiteralNode(source);
        }
      },
      // ExportNamedDeclaration: export { x } from "./something"
      ExportNamedDeclaration: ({ source, exportKind }) => {
        if (source && (checkAlsoType || exportKind !== "type")) {
          checkLiteralNode(source);
        }
      },
    };
  },
});
