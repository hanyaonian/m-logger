/**
 * @param key key in location-search
 * @returns string-value
 */
export function getUrlQuery(key: string): string {
  return new URLSearchParams(location.search).get(key) ?? "";
}
