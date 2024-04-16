/**
 * @param key key in location-search or process env
 * @returns string-value
 */
export function getEnv(key: string): string {
  if (env === "browser") {
    return new URLSearchParams(location.search).get(key) ?? "";
  }
  return (getArgv(key) || process.env[key] || "").trim();
}

const getArgv = (key: string) => {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [argKey, value] = arg.split("=");
      if (argKey.substring(2) === key) {
        return value;
      }
    }
  }
  return null;
};

export const env = (function () {
  if (typeof exports !== "undefined" && typeof module !== "undefined" && module.exports) {
    return "node";
  } else {
    return "browser";
  }
})();
