export function isDefined<T>(val: T | undefined | null | void): val is T {
  return val !== undefined && val !== null;
}
