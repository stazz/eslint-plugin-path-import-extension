/**
 * @file This file contains reusable callback to create ESLint rules specific to this package.
 */
import {
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";
import { type JSONSchema4 } from "json-schema";
import * as path from "node:path";
import * as fs from "node:fs";

/**
 * Default export, which is callback to create new rules, with fixed help URL creation.
 */
export default ESLintUtils.RuleCreator(
  () => "https://github.com/stazz/eslint-plugin-path-import-extension",
);

/**
 * The schema for rule options.
 */
export const optionsSchema: Array<JSONSchema4> = [
  // The extension that rule will enforce.
  {
    oneOf: [
      {
        type: "null",
      },
      {
        type: "string",
      },
    ],
  },
  // Should the rule be applied also for "type" imports?
  {
    oneOf: [
      {
        type: "null",
      },
      {
        type: "boolean",
      },
    ],
  },
  // Known extensions
  {
    oneOf: [
      {
        type: "null",
      },
      {
        type: "array",
        items: {
          type: "string",
        },
      },
    ],
  },
];

/**
 * This type is runtime type of options for rules of this plugin, as represented by JSON schema {@link optionsSchema}.
 */
export type Options = [
  string | null,
  boolean | null,
  ReadonlyArray<string> | null,
]; // We could use "json-schema-to-ts" module here, but unfortunately that operates on JSON Schema 7, while ESLint operates on JSON Schema 4

/**
 * The default options for the rules.
 */
export const defaultOptions = [
  ".js",
  false,
  [".ts", ".mjs", ".mts", ".ets", ".ejs", ".js"],
] satisfies Options;

/**
 * Helper function to get named options from ESLint options array.
 * @param param0 The ESLint options array.
 * @param param0."0" Privately deconstructed variable.
 * @param param0."1" Privately deconstructed variable.
 * @param param0."2" Privately deconstructed variable.
 * @returns Named options, using defaults if options array did not have element for that option.
 */
export const getOptions = ([
  extension,
  checkAlsoType,
  knownExtensions,
]: Readonly<Options>) => ({
  extension: extension ?? defaultOptions[0],
  checkAlsoType: checkAlsoType ?? defaultOptions[1],
  knownExtensions: knownExtensions ?? defaultOptions[2],
});

/**
 * Creates callback which can be used to check whether rule should trigger for given import/export path.
 * @param extension The extension to enforce.
 * @returns Callback which will return `true` if given path is relative path, and the path doesn't end with given extension.
 */
export const createShouldTriggerForString =
  (extension: string) => (source: string) => {
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
export const createFix = (
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
