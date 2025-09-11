export type Tuple = [unknown, unknown];

/**
 * Check if a value is a tuple with exactly 2 elements.
 *
 * This utility function is a type guard that narrows the type to
 * `[unknown, unknown]` when the value is an array with exactly 2 elements.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an array with exactly 2 elements, `false` otherwise.
 * @example
 *   isTuple([1, 2]);            // true
 *   isTuple(['a', 'b']);        // true
 *   isTuple(['a', ['b', 'c']]); // true (nested tuples)
 *   isTuple([1]);               // false
 *   isTuple([1, 2, 3]);         // false
 *   isTuple('not array');       // false
 */
export const isTuple = (value: unknown): value is Tuple => {
  return Array.isArray(value) && value.length === 2;
};
