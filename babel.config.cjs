const config = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
  plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
};

module.exports = config;
