/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @file This file contains unit tests for file "../requireRelativeImportExtension".
 */
import test from "ava";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import spec, { MESSAGE_MISSING_EXTENSION } from "../requirePathImportExtension";
import { type Options } from "../ruleCreator";
import setupAVA from "./setupAva";

setupAVA(test);
const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

interface TestOpts {
  fixedCode?: string;
  options?: Options;
}

const performTest = (
  name: string,
  code: string,
  { fixedCode, ...opts }: TestOpts = {},
) => {
  ruleTester.run(name, spec, {
    invalid: fixedCode
      ? [
          {
            code,
            errors: [
              {
                messageId: MESSAGE_MISSING_EXTENSION,
                type: AST_NODE_TYPES.Literal,
              },
            ],
            output: fixedCode,
            ...opts,
          },
        ]
      : [],
    valid: fixedCode ? [] : [{ code, ...opts }],
  });
};

performTest(
  "Non-relative import is not detected to be a problem",
  'import dummy from "dummy"',
);
performTest(
  "Relative import without extension should be auto-fixed",
  'import dummy from "./dummy"',
  { fixedCode: 'import dummy from "./dummy.js"' },
);
performTest(
  "Relative import without extension should be auto-fixed, single-quote edition",
  "import dummy from './dummy'",
  { fixedCode: "import dummy from './dummy.js'" },
);
performTest(
  "Relative import with correct extension is not detected to be a problem",
  'import dummy from "./dummy.js"',
);
performTest(
  "Relative import with incorrect extension is auto-fixed to have extensionless string + enforced extension",
  'import dummy from "./dummy.ts"',
  { fixedCode: 'import dummy from "./dummy.js"' },
);
performTest(
  "Absolute import without extension should be auto-fixed",
  'import dummy from "/dummy"',
  { fixedCode: 'import dummy from "/dummy.js"' },
);
performTest(
  "Relative import to directory should be auto-fixed",
  'import dummy from "./src"',
  { fixedCode: 'import dummy from "./src/index.js"' },
);
