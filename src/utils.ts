/**
 * @param key key in location-search
 * @returns string-value
 */
export function getQuery(key: string): string {
  const query = new URLSearchParams(location.search);
  return query.get(key);
}