/**
 * @file This file contains rule definition for "require-path-import-extension".
 */
import type { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as ruleHelpers from "../../rule-helpers";

export const RULE_NAME = ruleHelpers.getRuleName(import.meta.url);
export const MESSAGE_MISSING_EXTENSION = "message-import-missing-extension";
export default ruleHelpers.createRule({
  name: RULE_NAME,
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Enforce extension to path-based imports.",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      [MESSAGE_MISSING_EXTENSION]: "Path-based import does not have extension.",
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
      // ImportDeclaration: import something from "something"
      ImportDeclaration: ({ source, importKind }) => {
        // I think ImportDeclaration node.importKind is "type" only when everything is "type"
        // So commenting out extra check for now.
        const hasAnyNonType = importKind !== "type";
        //  ||
        // node.specifiers.some(
        //   (specifier) =>
        //     specifier.type === AST_NODE_TYPES.ImportSpecifier &&
        //     specifier.importKind !== "type",
        // );
        if (checkAlsoType || hasAnyNonType) {
          checkLiteralNode(source);
        }
      },
      // Importimport("something")
      ImportExpression: ({ source }) => {
        // Import expression can not have 'type' modifier
        if (source.type === AST_Literal) {
          checkLiteralNode(source);
        }
      },
    };
  },
});

// This allows us to push "@typescript-eslint/utils" dependency into type-realm instead of runtime-dependency.
const AST_Literal = "Literal" as const satisfies `${AST_NODE_TYPES.Literal}`;
