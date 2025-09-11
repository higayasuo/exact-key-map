import { isEntriesArray } from './isEntriesArray';

/**
 * Converts input parameters into a normalized entries array format.
 *
 * This utility function handles two input patterns:
 * 1. A single entries array (array of key-value pairs)
 * 2. Variadic key-value pairs as separate arguments
 *
 * It uses `isEntriesArray` to determine the input format and returns
 * a consistent entries array structure.
 *
 * @typeParam Entries - The expected entries type extending readonly array of key-value pairs
 * @param first - Either an entries array or the first key-value pair
 * @param rest - Additional key-value pairs when using variadic format
 * @returns A normalized entries array containing all key-value pairs
 *
 * @example
 * ```typescript
 * // Single entries array input
 * const entries1 = toEntriesArray([['a', 1], ['b', 2]]);
 * // Result: [['a', 1], ['b', 2]]
 *
 * // Variadic key-value pairs input
 * const entries2 = toEntriesArray(['a', 1], ['b', 2]);
 * // Result: [['a', 1], ['b', 2]]
 *
 * // Empty entries array
 * const entries3 = toEntriesArray([]);
 * // Result: []
 * ```
 */
export const toEntriesArray = (
  first: ReadonlyArray<readonly unknown[]> | readonly [unknown, unknown],
  ...rest: readonly [unknown, unknown][]
): readonly (readonly [unknown, unknown])[] =>
  isEntriesArray(first)
    ? (first as ReadonlyArray<readonly [unknown, unknown]>)
    : [first as [unknown, unknown], ...rest];
