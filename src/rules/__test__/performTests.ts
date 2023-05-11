/**
 * @file This file contains common test utilities to run tests for ESLint rules.
 */
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { type Options } from "../ruleCreator";
import type { RuleModule } from "@typescript-eslint/utils/dist/ts-eslint";

/**
 * Runs tests for given test specifications.
 * @param rule The rule to test.
 * @param messageId The message ID of the message for invalid code.
 * @param testSpecs The array of {@link TestOpts} specifying tests to run.
 * @returns An array of `undefined` (`void`) objects for each given element in `testSpecs`.
 */
export default <TMessageIds extends string>(
  rule: RuleModule<TMessageIds, Options>,
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
  options?: Options;
  /**
   * The filename to simulate when ESLint rule is invoked.
   */
  filename?: string;
}

const performTest =
  <TMessageIds extends string>(
    rule: RuleModule<TMessageIds, Options>,
    messageId: TMessageIds,
    ruleTester: ESLintUtils.RuleTester,
  ) =>
  ({ name, code, fixedCode, ...opts }: TestOpts) =>
    ruleTester.run(name, rule, {
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
              ...opts,
            },
          ]
        : [],
      valid: fixedCode ? [] : [{ code, ...opts }],
    });
