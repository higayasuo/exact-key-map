import { Entry } from '@/types/Entry';

export type Tuple = readonly [unknown, unknown];

/**
 * Determines if the provided value is an entry tuple.
 *
 * An entry tuple is defined as an array of length 2 where both elements
 * can be of any type. This function serves as a type guard that narrows
 * the type to `Entry` when the value is an array with exactly 2 elements.
 *
 * @param value - The value to check.
 * @returns True if the value is an array with exactly 2 elements; otherwise false.
 *
 * @example
 * ```ts
 * isEntry([1, 2]);            // true
 * isEntry(['a', 'b']);        // true
 * isEntry(['a', ['b', 'c']]); // true (nested tuples)
 * isEntry([1]);               // false
 * isEntry([1, 2, 3]);         // false
 * isEntry('not array');       // false
 * ```
 */
export const isEntry = (value: unknown): value is Entry => {
  return Array.isArray(value) && value.length === 2;
};
