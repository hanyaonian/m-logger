/**
 * @param key key in location-search
 * @returns string-value
 */
export function getUrlQuery(key: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? "";
}
