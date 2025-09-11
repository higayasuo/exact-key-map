/**
 * Type guard that determines if the provided value is an array of entries.
 *
 * This function checks if the input is an array and either:
 * - An empty array, or
 * - An array where the first element is itself an array (indicating entries structure)
 *
 * @param first - The value to check
 * @returns `true` if the input is an entries array, `false` otherwise
 *
 * @example
 * ```typescript
 * const entries = [['key1', 'value1'], ['key2', 'value2']];
 * const singleEntry = ['key', 'value'];
 *
 * isEntriesArray(entries);     // true
 * isEntriesArray(singleEntry); // false
 * isEntriesArray([]);          // true (empty entries array)
 * ```
 */
export const isEntriesArray = (
  first: unknown,
): first is readonly (readonly unknown[])[] =>
  Array.isArray(first) &&
  ((first as unknown[]).length === 0 || Array.isArray((first as unknown[])[0]));
