/**
 * @file This file contains code related to actual check performed by rule on a AST node for literal values.
 */
import { type TSESLint, type TSESTree } from "@typescript-eslint/utils";
import * as path from "node:path";
import * as fs from "node:fs";
import type { Options } from "./options";

/**
 * Creates callback which will report an issue to `ctx` if the given {@link TSESTree.Literal} is relative path without correct extension.
 * @param ctx The {@link TSESLint.RuleContext}
 * @param messageId The ID of the message to use when reporting the error.
 * @param extension The extension to use when auto-fixing.
 * @param knownExtensions The known extension to check when auto-fixing.
 * @returns The callback to use to check the {@link TSESTree.Literal} nodes.
 */
export default <TMessageId extends string>(
  ctx: Readonly<TSESLint.RuleContext<TMessageId, Options>>,
  messageId: TMessageId,
  extension: NonNullable<Options[0]>,
  knownExtensions: NonNullable<Options[2]>,
) => {
  const shouldTriggerForString = createShouldTriggerForString(extension);
  return (node: TSESTree.Literal) => {
    if (typeof node.value === "string" && shouldTriggerForString(node.value)) {
      ctx.report({
        node,
        messageId,
        fix: createFix(extension, knownExtensions, node, ctx.getFilename()),
      });
    }
  };
};
/**
 * Creates callback which can be used to check whether rule should trigger for given import/export path.
 * @param extension The extension to enforce.
 * @returns Callback which will return `true` if given path is relative path, and the path doesn't end with given extension.
 */
const createShouldTriggerForString =
  (extension: NonNullable<Options[0]>) => (source: string) => {
    return (
      (isRelative(source) || source.startsWith("/")) &&
      !source.endsWith(extension)
    );
  };

/**
 * Creates a {@link TSESLint.ReportFixFunction} for specified extension and node.
 * @param extension The extension to use.
 * @param knownExtensions Known extensions to strip before appending the given `extension`.
 * @param node The {@link TSESTree.StringLiteral} AST node.
 * @param filename The filename of the current TS file.
 * @returns The {@link TSESLint.RuleFix} element.
 */
const createFix = (
  extension: NonNullable<Options[0]>,
  knownExtensions: NonNullable<Options[2]>,
  node: TSESTree.StringLiteral,
  filename: string,
): TSESLint.ReportFixFunction => {
  const quoteOrBacktick = node.raw[0];
  const targetFilePath = node.value;
  let stringFixerFunc: typeof fixSourceSpecString | undefined;
  const resolved = path.resolve(filename, targetFilePath);
  const statResult = fs.statSync(resolved, { throwIfNoEntry: false });
  if (statResult?.isDirectory()) {
    stringFixerFunc = () => `${targetFilePath}/index`;
  }
  return (fixer) =>
    fixer.replaceText(
      node,
      `${quoteOrBacktick}${(stringFixerFunc ?? fixSourceSpecString)(
        knownExtensions,
        targetFilePath,
      )}${extension}${quoteOrBacktick}`,
    );
};

const fixSourceSpecString = (
  knownExtensions: NonNullable<Options[2]>,
  sourceWithoutQuotes: string,
) => {
  if (knownExtensions.some((ext) => sourceWithoutQuotes.endsWith(ext))) {
    sourceWithoutQuotes = sourceWithoutQuotes.substring(
      0,
      sourceWithoutQuotes.lastIndexOf("."),
    );
  }
  return sourceWithoutQuotes;
};

const isRelative = (pathStr: string) => pathStr.startsWith(".");
