import type { KeysOfEntries } from './KeysOfEntries';
import type { ValueOfKey } from './ValueOfKey';

/**
 * Resolve the union of all value types from an `Entries` list of readonly
 * `[Key, Value]` pairs.
 *
 * This utility extracts the value type for each key in the entries and
 * creates a union of all those value types. It's used internally by
 * `ExactKeyMap` to define the value type of the underlying `Map`.
 *
 * - Primitive values are preserved as-is (no widening)
 * - Nested entry arrays become `ExactKeyMap` instances (with recursively
 *   normalized child values)
 * - The result is a union of all possible value types for the provided entries
 *
 * @typeParam Entries - A readonly list of readonly `[Key, Value]` pairs.
 * @example
 *   type E = readonly [["id", 1], ["name", "foo"], ["active", true]];
 *   type Values = AllValues<E>; // 1 | "foo" | true
 *
 * @example
 *   type Nested = readonly [["child", [["x", 1]]]];
 *   type Values = AllValues<Nested>; // ExactKeyMap<[["x", 1]]>
 */
export type AllValues<
  Entries extends readonly (readonly [unknown, unknown])[],
> = ValueOfKey<Entries, KeysOfEntries<Entries>>;
