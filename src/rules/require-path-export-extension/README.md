# ESLint Rule: `path-import-extension/require-path-export-extension`

The ESLint rule `path-import-extension/require-path-export-extension` is provided by [`eslint-plugin-path-import-extension`](../../../) library.
This rule will trigger on any `export` statements with source string literal (in TypeScript file, or JavaScript ES module), which are _path-like_, but don't have a file extension.
Here, _path-like_ means that the the source string literal starts with `.` or `/` character.

This kind of transformation is extremely useful when creating a library with TypeScript, which should be able to run on both CommonJS and ESM runtimes.
In such case, the output ESM `.js` files may be auto-fixed by ESLint and this rule to have all the export references to have file extension, as is habit in ESM runtime, while still using extensionless strings in TS code.
That enables running TS-Node on TS code without transpiling it.

For example, the code `export { x } from "./y"` in a `.js` or `.ts` file is deemed to be **invalid**, and auto-fixer will fix it to be `export { x } from "./.js"`.
Also, the all-export statement `export * from "./y"` in a `.js` or `.ts` file will be auto-fixed to `export * from "./y.js"`.
Please see the [test file](../__test__/require-path-export-extension.spec.ts) for more examples on valid and invalid code.

This rule accepts exactly one option value, which is an object with all properties being optional.
See [options file](../../rule-helpers/options.ts) for JSON schema of the rule, and corresponding TS type.
