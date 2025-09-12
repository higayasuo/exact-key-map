import { ExactKeyMap } from '@/exact-key-map/ExactKeyMap';
import { Widen } from './Widen';

/**
 * Normalizes a value by converting nested entry arrays to ExactKeyMap instances
 * and widening primitive values to their base types.
 *
 * This utility type recursively processes values:
 * - If the value is an array of key-value pairs, it converts it to an `ExactKeyMap`
 *   with recursively normalized values.
 * - Otherwise, it widens the value using the `Widen` type.
 *
 * @typeParam V - The value to normalize, which can be a primitive, array of entries, or nested structure.
 *
 * @example
 * ```typescript
 * type Primitive = NormalizeValue<'hello'>; // string
 * type Number = NormalizeValue<42>; // number
 *
 * type Entries = NormalizeValue<[['name', 'Alice'], ['age', 30]]>;
 * // ExactKeyMap<[['name', string], ['age', number]]>
 *
 * type Nested = NormalizeValue<[['profile', [['id', 1]]]]>;
 * // ExactKeyMap<[['profile', ExactKeyMap<[['id', number]]>]]>
 * ```
 */
export type NormalizeValue<V> = V extends readonly (readonly [
  unknown,
  unknown,
])[]
  ? ExactKeyMap<{
      [I in keyof V]: V[I] extends readonly [infer Key, infer Val]
        ? [Key, NormalizeValue<Val>]
        : V[I];
    }>
  : Widen<V>;
