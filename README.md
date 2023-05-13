# Path-like Import/Export Extension Fixer - ESLint Plugin
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Options](#options)
- [Rules](#rules)

# Overview

The ESLint plugin `eslint-plugin-path-import-extension` allows automation of managing extensions of *path-like* imports (and exports) in TypeScript code.
The *path-like* import means that the import/export target (string) starts either with `.` or `/`.
If such import/export is detected, and it doesn't have an extension as configured for this plugin, this plugin will attempt to fix the situation by appending the extension.
It also understands targets to directories and will fix them to `{directory}/index.{extension}`.

The most typical usecase for this plugin is when one is creating a library with TypeScript, that library is supposed to run in both CommonJS and ESM runtime environments.
At the same time, it is desireable *NOT* to use any extensions used in imports/exports within the TS code, in order to be able to run and test it without transpiling via `ts-node` or other tools.
The problem that is solved by this plugin arises when often in such cases, the transpiled CommonJS and ESM codebases are placed each in its own directory as `.js` files, and `package.json` will have its `type` set to `module`.
The relative imports/exports within the ESM variant of `.js` files will then become broken if included from `.mjs` file (but will work if included from `.js` file!).
This ESLint plugin is thus applied to the ESM variant of `.js` files to transform all of the relative, extensionless imports/exports, to have the correct extension in the string literals.

One might think this is the job for TS compiler, but TS team has been adamant on their stance that TS compiler will not interfere in any way into imports/exports of the code being transpiled.
Thus, this ESLint plugin will fill in the niché of needing to append extensions to imports/exports within ESM-variant JavaScript files.
The plugin will, however, also work for TS code without any extra configuration.

# Installation
Assuming that ESLint has already been installed
```sh
yarn add --dev eslint@latest
```
, install this plugin:
```sh
yarn add --dev eslint-plugin-path-import-extension
```

# Configuration
In the `plugins` section of the [ESLint configuration](https://eslint.org/docs/latest/use/configure), specify the newly installed plugin:
```json
{
  "plugins": [
    "path-import-extension"
  ]
}
```

Then, extend the recommended set (which configures both rules of this plugin to be treated as `error`):
```json
{
  "extends": [
    "plugin:path-import-extension/recommended"
  ]
}
```

Alternatively, it is possible to configure each rule individually:
```json
{
  "rules": {
    "path-import-extension/require-path-export-extension": "error", // Recommended
    "path-import-extension/require-path-import-extension": "error" // Recommented
  }
}
```

# Options
Both rules exposed by this plugin take optional individual options.
These options adher to single schema, which is a **JSON object** with the following properties:
- `extension` of type `string` : the extension to check for the targets of imports/exports.
  By default, the extension is deduced based on the extension of the source code file being processed by ESLint: `.js` and `.ts` files will use `.js`, `.mjs` and `.mts` files will use `.mjs`, and `.cts` and `.cjs` files will use `.cjs` as extension to check and fix relative imports/exports.
- `checkAlsoType` of type `boolean` : Whether to trigger the rules on targets of import/export statements which have one or more `type` specifier in them. Default is `false`.
- `knownExtensions` of type `Array<string>` : The extensions which will cause to be replaced (as opposed to appending) when doing auto-fix. The default is `[".js", ".ts", ".mjs", ".mts", ".cjs", ".cts"]`.
- `ignoreExtensions` of type `Array<string>` : The extensions which will cause the rule to never to trigger. The default is `[".json"]`.

For more information, see [JSON schema specification and TS type in source code](./src/rule-helpers/options.ts).

# Rules
All of the rules currently are fixable, and can be fixed automatically by running ESLint CLI with `--fix` flag.

|    recommended     | fixable  |                                    rule                                    |                             description                             |
| :----------------: | :------: | :------------------------------------------------------------------------: | :-----------------------------------------------------------------: |
| :white_check_mark: | :wrench: | [require-path-export-extension](./src/rules/require-path-export-extension) | Checks and fixes the target string literals in `export` statements. |
| :white_check_mark: | :wrench: | [require-path-import-extension](./src/rules/require-path-import-extension) | Checks and fixes the target string literals in `import` statements. |
