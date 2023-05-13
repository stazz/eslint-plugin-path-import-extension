/**
 * @file This file contains common test utilities to run tests for ESLint rules.
 */
import {
  AST_NODE_TYPES,
  TSESLint,
  ESLintUtils,
} from "@typescript-eslint/utils";
import { type ESLintOptions } from "../../rule-helpers";
import * as url from "node:url";

/**
 * Runs tests for given test specifications.
 * @param rule The rule to test.
 * @param messageId The message ID of the message for invalid code.
 * @param testSpecs The array of {@link TestOpts} specifying tests to run.
 * @returns An array of `undefined` (`void`) objects for each given element in `testSpecs`.
 */
export default <TMessageIds extends string>(
  rule: TSESLint.RuleModule<TMessageIds, ESLintOptions>,
  messageId: TMessageIds,
  testSpecs: ReadonlyArray<TestOpts>,
) =>
  testSpecs.map(
    performTest(
      rule,
      messageId,
      new ESLintUtils.RuleTester({
        parser: "@typescript-eslint/parser",
      }),
    ),
  );

/**
 * This interface represents necessary information for one ESLint rule test case.
 */
export interface TestOpts {
  /**
   * The name of the test case.
   */
  name: string;
  /**
   * The TS code to be tested.
   */
  code: string;
  /**
   * If present, the TS code that should match the fixed code.
   * This implies that the `code` specified is deemed to be invalid by ESLint rule.
   */
  fixedCode?: string;
  /**
   * The optional options for ESLint rule.
   */
  options?: ESLintOptions;
  /**
   * The filename to simulate when ESLint rule is invoked.
   */
  filename?: string;
  /**
   * Whether the code being run is TypeScript, as opposed to default ESM syntax.
   */
  isTypeScript?: boolean;
}

const performTest =
  <TMessageIds extends string>(
    rule: TSESLint.RuleModule<TMessageIds, ESLintOptions>,
    messageId: TMessageIds,
    ruleTester: ESLintUtils.RuleTester,
  ) =>
  ({ name, code, fixedCode, isTypeScript, ...opts }: TestOpts) => {
    isTypeScript = isTypeScript || opts.options?.[0]?.checkAlsoType === true;
    return ruleTester.run(name, rule, {
      invalid: fixedCode
        ? [
            {
              code,
              errors: [
                {
                  messageId,
                  type: AST_NODE_TYPES.Literal,
                },
              ],
              output: fixedCode,
              ...(isTypeScript
                ? {}
                : {
                    parser: parserAbsolutePath,
                    parserOptions: {
                      requireConfigFile: false,
                    },
                  }),
              ...opts,
            },
          ]
        : [],
      valid: fixedCode ? [] : [{ code, ...opts }],
    });
  };

const parserAbsolutePath = url.fileURLToPath(
  new URL(
    await (async () => {
      const maybeResolved = await import.meta.resolve?.("@babel/eslint-parser");
      if (!maybeResolved) {
        throw new Error(
          "Please run with '--experimental-import-meta-resolve' Node flag.",
        );
      }
      return maybeResolved;
    })(),
  ),
);
