// @ts-check
// @see https://typescript-eslint.io/getting-started/typed-linting/monorepos
// @see https://typescript-eslint.io/packages/typescript-eslint/#usage-with-other-plugins
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ["**/dist/**", "*.js", "*.mjs", "*.cjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        // import.meta.dirname is only present for ESM files in Node.js >=20.11.0 / >= 21.2.0.
        // For CommonJS modules and/or older versions of Node.js, use __dirname or an alternative.
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-debugger": "error",
      "no-restricted-syntax": "warn",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/naming-convention": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // disable type-aware linting on JS files
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  }
);
