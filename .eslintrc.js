module.exports = {
  parser: "@typescript-eslint/parser",
  rules: {
    "no-debugger": "error",
    "no-unused-vars": ["error", { varsIgnorePattern: ".*", args: "none" }],
    "no-restricted-globals": ["error", ...["window", "document"]],
    "no-restricted-syntax": [
      "error",
      "ObjectPattern > RestElement",
      "ObjectExpression > SpreadElement",
      "AwaitExpression",
    ],
  },
};
