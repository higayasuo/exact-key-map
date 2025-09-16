import { ExtractExactEntry } from './ExtractExactEntity';
import { NormalizeValue } from './NormalizeValue';
import { Es } from './Es';
import { Entry } from './Entry';

/**
 * Resolve the value type associated with a given key `K` from an `Entries`
 * list of readonly `[Key, Value]` pairs.
 *
 * Behavior:
 * - If the matched `Value` is itself an array of entry pairs, it is recursively
 *   converted to an `ExactKeyMap` with child values normalized (no widening).
 * - Otherwise, the matched `Value` is preserved as-is (literal-friendly).
 *
 * @typeParam Entries - A readonly list of readonly `[Key, Value]` pairs.
 * @typeParam K - The key whose associated value type should be extracted.
 * @example
 *   type E = readonly [["id", 1], ["name", "foo"]];
 *   type V1 = ValueOfKey<E, "id">;   // 1
 *   type V2 = ValueOfKey<E, "name">; // "foo"
 *
 * @example
 *   type Nested = readonly [["child", readonly [["x", 1]]]];
 *   // For nested entries, the value becomes an ExactKeyMap with literal values
 *   type V3 = ValueOfKey<Nested, "child">; // ExactKeyMap<readonly [["x", 1]]>
 */
export type ValueOfKey<Entries extends Es<Entry>, K> = // Try to find exact match entries first
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
