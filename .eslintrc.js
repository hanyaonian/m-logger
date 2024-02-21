module.exports = {
  parser: "@typescript-eslint/parser",
  /* @see {link https://typescript-eslint.io/getting-started/typed-linting/} */
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": "error",

    // TODO: complete it
    "@typescript-eslint/naming-convention": "warn",

    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/consistent-type-assertions": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "no-restricted-syntax": [
      "error",
      "ObjectPattern > RestElement",
      "ObjectExpression > SpreadElement",
      "AwaitExpression",
    ],
  },
};
