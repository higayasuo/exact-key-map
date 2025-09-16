import { Entry } from './Entry';
/**
 * A type alias for a readonly array of tuples with two elements.
 *
 * @template T - A tuple type that extends readonly [unknown, unknown]
 * @example
 * ```typescript
 * type MyEntries = Es<['name', string] | [1, boolean]>;
 * const entries: MyEntries = [['name', 'Alice'], [1, true]];
 * ```
 */
export type Es<T extends Entry> = ReadonlyArray<T>;
