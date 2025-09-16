import { isEntry } from './isEntry';
import { Es } from '@/types/Es';
import { Entry } from '@/types/Entry';

/**
 * Determines if the provided value is an array of entry tuples.
 *
 * An entry tuple is defined as an array of length 2 where both elements
 * can be of any type. This function checks if the given value is an array where
 * every element is such a tuple.
 *
 * @param value - The value to check.
 * @returns True if the value is an array of entry tuples; otherwise false.
 *
 * @example
 * ```ts
 * isEntries([['name', 'Alice'], [1, true]]); // true
 * isEntries([['key', 'value'], ['anotherKey', 42]]); // true
 * isEntries(['not-a-tuple']); // false
 * isEntries([{ key: 'value' }]); // false
 * ```
 */
export const isEntries = (value: unknown): value is Es<Entry> => {
  return Array.isArray(value) && value.every(isEntry);
};
