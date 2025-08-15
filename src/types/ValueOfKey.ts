import type { ExactKeyMap } from '../ExactKeyMap';
import type { Widen } from './Widen';

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
> = Extract<Entries[number], readonly [K, unknown]>[1] extends infer V
  ? V extends readonly (readonly [unknown, unknown])[]
    ? ExactKeyMap<{
        [I in keyof V]: V[I] extends readonly [infer Key, infer Val]
          ? [Key, Widen<Val>]
          : V[I];
      }>
    : Widen<V>
  : never;
