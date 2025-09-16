import { ExactKeyMap } from '@/exact-key-map/ExactKeyMap';
import { Es } from './Es';
import { Entry } from './Entry';

/**
 * Normalizes a value by converting nested entry arrays into `ExactKeyMap` instances.
 *
 * Behavior:
 * - If the value is an array of key-value entry pairs, it is converted to an
 *   `ExactKeyMap` with recursively normalized child values.
 * - Otherwise, the value is preserved as-is (no widening or transformation).
 *
 * @typeParam V - The value to normalize. Can be a primitive, an entries array,
 * or a nested entries structure.
 *
 * @example
 * ```typescript
 * // Primitives are preserved as-is (no widening)
 * type S1 = NormalizeValue<'hello'>;  // 'hello'
 * type S2 = NormalizeValue<string>;   // string
 * type N1 = NormalizeValue<42>;       // 42
 * type N2 = NormalizeValue<number>;   // number
 * type B1 = NormalizeValue<true>;     // true
 * type B2 = NormalizeValue<boolean>;  // boolean
 *
 * // Non-entry tuples/arrays are preserved
 * type T1 = NormalizeValue<[1, 'a']>;             // [1, 'a']
 * type A1 = NormalizeValue<Array<number>>;        // Array<number>
 * type RO = NormalizeValue<readonly ['x', 1]>;    // readonly ['x', 1]
 *
 * // Entries become ExactKeyMap with recursively normalized child values
 * type Entries = NormalizeValue<[['name', 'Alice'], ['age', 30]]>;
 * // ExactKeyMap<[['name', 'Alice'], ['age', 30]]>
 *
 * type Nested = NormalizeValue<[['profile', [['id', 1]]]]>;
 * // ExactKeyMap<[['profile', ExactKeyMap<[['id', 1]]>]]>
 * ```
 */
export type NormalizeValue<V> =
  V extends Es<Entry>
    ? ExactKeyMap<{
        [I in keyof V]: V[I] extends readonly [infer Key, infer Val]
          ? [Key, NormalizeValue<Val>]
          : V[I];
      }>
    : V;
