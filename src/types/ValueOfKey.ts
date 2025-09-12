import { ExtractExactEntry } from './ExtractExactEntity';
import { NormalizeValue } from './NormalizeValue';

/**
 * Resolve the value type associated with a given key `K` from an `Entries`
 * list of readonly `[Key, Value]` pairs.
 *
 * - If the matched `Value` itself is a list of entry pairs, it is recursively
 *   converted to an `ExactKeyMap` with widened value types.
 * - If the matched `Value` is a literal primitive (e.g. `'x' | 1 | true`), it
 *   is widened to its base primitive (`string | number | boolean`, etc.).
 *
 * @typeParam Entries - A readonly list of readonly `[Key, Value]` pairs.
 * @typeParam K - The key whose associated value type should be extracted.
 * @example
 *   type E = readonly [["id", 1], ["name", "foo"]];
 *   type V1 = ValueOfKey<E, "id">;   // number
 *   type V2 = ValueOfKey<E, "name">; // string
 *
 * @example
 *   type Nested = readonly [["child", readonly [["x", 1]]]];
 *   // For nested entries, the value becomes an ExactKeyMap with widened values
 *   type V3 = ValueOfKey<Nested, "child">; // ExactKeyMap<readonly [["x", number]]>
 */
export type ValueOfKey<
  Entries extends readonly (readonly [unknown, unknown])[],
  K,
> = // Try to find exact match entries first
  ExtractExactEntry<Entries, K> extends infer Exact
    ? [Exact] extends [never]
      ? // No exact matches: allow catch-all entries where K is a subtype of the entry key
        Entries[number] extends infer T
        ? T extends readonly [infer Key, infer Val]
          ? K extends Key
            ? NormalizeValue<Val>
            : never
          : never
        : never
      : // Exact match found; transform its value shape
        Exact extends readonly [K, infer V]
        ? NormalizeValue<V>
        : never
    : never;
