/**
 * @file This file contains rule definition for "require-relative-import-extension".
 */
import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";
import ruleCreator, {
  type Options,
  optionsSchema,
  defaultOptions,
  getOptions,
  createShouldTriggerForString,
  createFix,
} from "./ruleCreator";

export const RULE_NAME = "require-path-import-extension";
export const MESSAGE_MISSING_EXTENSION = "message-import-missing-extension";
export default ruleCreator({
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
    schema: optionsSchema,
  },
  defaultOptions,
  create: (
    // We must use explicit typing for context, as otherwise we will get TypeScript AST-based context.
    // What we want is TS-ESLing AST-based context, since we specify "@typescript-eslint/parser" as parser in configs/recommended.ts.
    ctx: Readonly<
      TSESLint.RuleContext<typeof MESSAGE_MISSING_EXTENSION, Options>
    >,
    opts,
  ) => {
    const { extension, checkAlsoType, knownExtensions } = getOptions(opts);
    const shouldTriggerForString = createShouldTriggerForString(extension);
    const checkModuleName = (node: TSESTree.Literal) => {
      if (
        typeof node.value === "string" &&
        shouldTriggerForString(node.value)
      ) {
        ctx.report({
          node,
          messageId: MESSAGE_MISSING_EXTENSION,
          fix: createFix(extension, knownExtensions, node),
        });
      }
    };
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
          checkModuleName(source);
        }
      },
      // Importimport("something")
      ImportExpression: ({ source }) => {
        // Import expression can not have 'type' modifier
        if (source.type === AST_NODE_TYPES.Literal) {
          checkModuleName(source);
        }
      },
    };
  },
});
