/**
 * @file This file contains rule definition for "require-path-export-extension".
 */
import * as ruleHelpers from "../rule-helpers/index.js";

export const RULE_NAME = "require-path-export-extension";
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
  create: (ctx, opts) => {
    const { extension, checkAlsoType, knownExtensions } =
      ruleHelpers.getOptions(ctx.getFilename(), opts);
    const checkLiteralNode = ruleHelpers.createLiteralNodeCheck(
      ctx,
      MESSAGE_MISSING_EXTENSION,
      extension,
      knownExtensions,
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
          // I guess currently this barely ever happens?
          checkLiteralNode(source);
        }
      },
    };
  },
});
