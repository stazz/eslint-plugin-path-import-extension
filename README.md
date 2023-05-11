# Path-like Import/Export Extension Fixer - ESLint Plugin
The ESLint plugin `eslint-plugin-path-import-extension` allows automation of managing extensions of *path-like* imports (and exports) in TypeScript code.
The *path-like* import means that the import target (string) starts either with `.` or `/`.
If such import is detected, and it doesn't have an extension as configured for this plugin, this plugin will attempt to fix the situation by appending the extension.
It also understands imports to directories and will fix them to `{directory}/index.{extension}`.

# Installation
TODO

# Rules
TODO
