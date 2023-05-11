/**
 * @file This file contains rule definition for "require-relative-export-extension".
 */
import { type TSESLint, type TSESTree } from "@typescript-eslint/utils";
import ruleCreator, {
  type Options,
  optionsSchema,
  defaultOptions,
  getOptions,
  createShouldTriggerForString,
  createFix,
} from "./ruleCreator";

export const RULE_NAME = "require-path-export-extension";
const MESSAGE_MISSING_EXTENSION = "message-export-missing-extension";
export default ruleCreator({
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
      [MESSAGE_MISSING_EXTENSION]: "path-based export does not have extension.",
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
      // ExportAllDeclaration: export * from "./something"
      ExportAllDeclaration: ({ source, exportKind }) => {
        if (checkAlsoType || exportKind !== "type") {
          checkModuleName(source);
        }
      },
      // ExportNamedDeclaration: export x = y
      ExportNamedDeclaration: ({ source, exportKind }) => {
        if (source && exportKind !== "type") {
          // I guess currently this barely ever happens?
          checkModuleName(source);
        }
      },
    };
  },
});
