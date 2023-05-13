/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @file This file contains unit tests for file "../require-path-export-extension/index.ts".
 */
import test from "ava";
import setupAVA from "./setupAva";
import performTests from "./performTests";
import spec, {
  MESSAGE_MISSING_EXTENSION,
} from "../require-path-export-extension";
import type { ESLintOptions } from "../../rule-helpers/options";

const optionsForTriggeringForTypedExports: ESLintOptions = [
  { checkAlsoType: true },
];
setupAVA(test);
performTests(spec, MESSAGE_MISSING_EXTENSION, [
  {
    name: "Non-relative export should not be detected to be a problem",
    code: 'export * from "dummy"',
  },
  {
    name: "Non-relative type export should not be detected to be a problem",
    code: 'export type * from "dummy"',
    isTypeScript: true,
  },
  {
    name: "Relative export without extension should be auto-fixed",
    code: 'export * as dummy from "./dummy"',
    fixedCode: 'export * as dummy from "./dummy.js"',
  },
  {
    name: "Relative type export without extension should not be detected to be a problem",
    code: 'export type * as dummy from "./dummy"',
  },
  {
    name: "Non-relative component export should not be detected to be a problem",
    code: 'export { dummy } from "dummy"',
  },
  {
    name: "Non-relative component type export should not be detected to be a problem",
    code: 'export type { dummy } from "dummy"',
    isTypeScript: true,
  },
  {
    name: "Relative component export should be auto-fixed",
    code: 'export { dummy } from "./dummy"',
    fixedCode: 'export { dummy } from "./dummy.js"',
  },
  {
    name: "Relative type component export should not be detected to be a problem",
    code: 'export type { dummy } from "./dummy"',
    isTypeScript: true,
  },
  // With types enabled
  {
    name: "Non-relative type export should not be detected to be a problem, when triggering for types",
    code: 'export type * from "dummy"',
    options: optionsForTriggeringForTypedExports,
  },
  {
    name: "Relative type export without extension should be auto-fixed, when triggering for types",
    code: 'export type * as dummy from "./dummy"',
    fixedCode: 'export type * as dummy from "./dummy.js"',
    options: optionsForTriggeringForTypedExports,
  },
  {
    name: "Non-relative component type export should not be detected to be a problem, when triggering for types",
    code: 'export type { dummy } from "dummy"',
    options: optionsForTriggeringForTypedExports,
  },
  {
    name: "Relative type component export should be auto-fixed when triggering for types",
    code: 'export type { dummy } from "./dummy"',
    fixedCode: 'export type { dummy } from "./dummy.js"',
    options: optionsForTriggeringForTypedExports,
  },
]);
