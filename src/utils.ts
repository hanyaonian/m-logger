/**
 * @param key key in location-search
 * @returns string-value
 */
export function getArg(key: string): string {
  return new URLSearchParams(location.search).get(key) ?? "";
}

/**
 * @description get formatting specifiers
 * @see {link https://console.spec.whatwg.org/#log}
 * */
export function getSpecifier(val: unknown) {
  switch (typeof val) {
    case "number": {
      if (Number.isInteger(val)) return "%i";
      return "%f";
    }
    case "function":
      return "%O";
    case "object":
      return "%o";
    default:
      return "%s";
  }
}
