/**
 * @file This file contains code related to rule options.
 */
import { type JSONSchema4 } from "json-schema";
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
export type Options = Readonly<
  [string | null, boolean | null, ReadonlyArray<string> | null]
>; // We could use "json-schema-to-ts" module here, but unfortunately that operates on JSON Schema 7, while ESLint operates on JSON Schema 4

/**
 * The default options for the rules.
 */
export const defaultOptions = [
  ".js",
  false,
  [".ts", ".mjs", ".mts", ".ets", ".ejs", ".js"],
] as const satisfies Options;

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
