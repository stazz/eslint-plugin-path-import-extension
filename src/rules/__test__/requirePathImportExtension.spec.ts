/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @file This file contains unit tests for file "../requirePathImportExtension".
 */
import test from "ava";
import setupAVA from "./setupAva";
import performTests from "./performTests";
import spec, { MESSAGE_MISSING_EXTENSION } from "../requirePathImportExtension";
import type { ESLintOptions } from "../../rule-helpers";
import * as path from "node:path";

const optionsForTriggeringForTypedExports: ESLintOptions = [
  { checkAlsoType: true },
];
setupAVA(test);
performTests(spec, MESSAGE_MISSING_EXTENSION, [
  {
    name: "Non-relative import should not be detected to be a problem",
    code: 'import dummy from "dummy"',
  },
  {
    name: "Non-relative type import should not be detected to be a problem",
    code: 'import type dummy from "dummy"',
    isTypeScript: true,
  },
  {
    name: "Relative import without extension should be auto-fixed",
    code: 'import dummy from "./dummy"',
    fixedCode: 'import dummy from "./dummy.js"',
  },
  {
    name: "Relative type import without extension should not be detected to be a problem",
    code: 'import type dummy from "./dummy"',
    isTypeScript: true,
  },
  {
    name: "Relative import without extension should be auto-fixed, single-quote edition",
    code: "import dummy from './dummy'",
    fixedCode: "import dummy from './dummy.js'",
  },
  {
    name: "Relative import with correct extension should not be detected to be a problem",
    code: 'import dummy from "./dummy.js"',
  },
  {
    name: "Relative import with incorrect extension should be auto-fixed to have extensionless string + enforced extension",
    code: 'import dummy from "./dummy.ts"',
    fixedCode: 'import dummy from "./dummy.js"',
  },
  {
    name: "Relative type import with incorrect extension should not be detected to be a problem",
    code: 'import type dummy from "./dummy.ts"',
    isTypeScript: true,
  },
  {
    name: "Absolute import without extension should be auto-fixed",
    code: 'import dummy from "/dummy"',
    fixedCode: 'import dummy from "/dummy.js"',
  },
  {
    name: "Relative import to directory should be auto-fixed",
    code: 'import dummy from "./src"',
    fixedCode: 'import dummy from "./src/index.js"',
    filename: path.join(process.cwd(), "file.ts"),
  },
  {
    name: "Relative import with multiple mixed elements should be auto-fixed",
    code: 'import dummy, { something, type somethingElse } from "./dummy"',
    fixedCode:
      'import dummy, { something, type somethingElse } from "./dummy.js"',
    isTypeScript: true,
  },
  {
    name: "Relative import with multiple type-only elements should not be detected to be a problem",
    code: 'import type dummy, { type something } from "./dummy"',
    isTypeScript: true,
  },
  {
    name: "Non-relative import _expression_ should not be detected to be a problem",
    code: 'import("dummy")',
  },
  {
    name: "Relative import _expression_ should be auto-fixed",
    code: 'import("./dummy")',
    fixedCode: 'import("./dummy.js")',
  },
  // With types enabled
  {
    name: "Non-relative type import should not be detected to be a problem, when triggering for types",
    code: 'import type dummy from "dummy"',
    options: optionsForTriggeringForTypedExports,
  },
  {
    name: "Relative type import without extension should be auto-fixed, when triggering for types",
    code: 'import type dummy from "./dummy"',
    fixedCode: 'import type dummy from "./dummy.js"',
    options: optionsForTriggeringForTypedExports,
  },
  {
    name: "Relative type import with incorrect extension should be auto-fixed, when triggering for types",
    code: 'import type dummy from "./dummy.ts"',
    fixedCode: 'import type dummy from "./dummy.js"',
    options: optionsForTriggeringForTypedExports,
  },
]);
