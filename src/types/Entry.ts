/**
 * A type representing a readonly tuple with exactly two elements of any type.
 *
 * This type is used to define key-value pairs where both the key and value
 * can be of any type, providing type safety for tuple operations.
 *
 * @example
 * ```typescript
 * const entry: Entry = ['key', 'value'];
 * const numericEntry: Entry = [1, true];
 * const mixedEntry: Entry = ['name', { id: 123 }];
 * ```
 */
export type Entry = readonly [unknown, unknown];
