/**
 * @file This file contains reusable callback to create ESLint rules specific to this package.
 */
import { ESLintUtils, TSESLint } from "@typescript-eslint/utils";
import {
  type ESLintOptions,
  optionsSchema,
  defaultOptions,
} from "./options.js";

/**
 * Creates callback to create new ESLint rules, which are bound to {@link Options} and using {@link TSESLint.RuleContext}.
 * @param root0 The arguments for the rule, except the ones which will be common.
 * @param root0.create Privately deconstructed variable.
 * @param root0.meta Privately deconstructed variable.
 * @returns The ESLint rule which is bound to {@link Options} and using {@link TSESLint.RuleContext}.
 */
export default <TMessageIds extends string>({
  create,
  meta,
  ...args
}: Readonly<
  Omit<
    ESLintUtils.RuleWithMetaAndName<
      ESLintOptions,
      TMessageIds,
      TSESLint.RuleListener
    >,
    "meta" | "defaultOptions" | "create"
  > & {
    meta: Omit<ESLintUtils.NamedCreateRuleMeta<TMessageIds>, "schema">;
    create: (
      // We must use explicit typing for context, as otherwise we will get TypeScript AST-based context.
      // What we want is TS-ESLing AST-based context, since we specify "@typescript-eslint/parser" as parser in configs/recommended.ts.
      ctx: Readonly<TSESLint.RuleContext<TMessageIds, ESLintOptions>>,
      options: ESLintOptions,
    ) => TSESLint.RuleListener;
  }
>) =>
  baseCreator({
    ...args,
    meta: {
      ...meta,
      schema: optionsSchema,
    },
    defaultOptions: [defaultOptions],
    create,
  });

const baseCreator = ESLintUtils.RuleCreator(
  () => "https://github.com/stazz/eslint-plugin-path-import-extension",
);
