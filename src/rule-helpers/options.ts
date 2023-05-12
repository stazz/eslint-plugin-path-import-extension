/**
 * @file This file contains code related to rule options.
 */
import { type JSONSchema4 } from "json-schema";
import * as path from "node:path";

/**
 * The schema for rule options.
 */
export const optionsSchema: Array<JSONSchema4> = [
  // The extension that rule will enforce.
  {
    type: "object",
    properties: {
      extension: {
        type: "string",
      },
      checkAlsoType: {
        type: "boolean",
      },
      knownExtensions: {
        type: "array",
        items: { type: "string" },
      },
    },
    minProperties: 0,
    maxProperties: 3,
  },
];

/**
 * This type is runtime type of options for rules of this plugin, as represented by JSON schema {@link optionsSchema}.
 */
export type Options = Readonly<
  Partial<{
    extension: string;
    checkAlsoType: boolean;
    knownExtensions: ReadonlyArray<string>;
  }>
>; // We could use "json-schema-to-ts" module here, but unfortunately that operates on JSON Schema 7, while ESLint operates on JSON Schema 4

/**
 * The type to use when declaring {@link Options} for ESLint.
 */
export type ESLintOptions = Readonly<[Options]>;

/**
 * The type after processing partial {@link Options} into full options.
 */
export type FullOptions = Readonly<{ [P in keyof Options]-?: Options[P] }>;

/**
 * The default options for the rules.
 */
export const defaultOptions = {
  checkAlsoType: false,
  knownExtensions: [".ts", ".mjs", ".mts", ".cts", ".cjs", ".js"],
} as const satisfies Options;

// eslint-disable-next-line jsdoc/require-param
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param */
/**
 * Helper function to get full options from ESLint partial options.
 * @param filename The path of the file being processed.
 * @param param1 The options.
 * @returns Named options, using defaults if options partial object did not have element for that option.
 */
export const getOptions = (
  filename: string,
  [opts]: ESLintOptions,
): FullOptions => ({
  extension:
    opts?.extension ??
    sourceFileExtensionToDefaultExtension[getExtName(filename)] ??
    DEFAULT_EXTENSION,
  checkAlsoType: opts?.checkAlsoType ?? defaultOptions.checkAlsoType,
  knownExtensions: opts?.knownExtensions ?? defaultOptions.knownExtensions,
});
/* eslint-enable jsdoc/check-param-names, jsdoc/require-param */

const DEFAULT_EXTENSION = ".js";
const sourceFileExtensionToDefaultExtension: Record<string, string> = {
  ".ts": DEFAULT_EXTENSION,
  ".mts": ".mjs",
  ".cts": ".cjs",
};

const getExtName = (filename: string) => {
  try {
    return path.extname(filename);
  } catch {
    return DEFAULT_EXTENSION;
  }
};
