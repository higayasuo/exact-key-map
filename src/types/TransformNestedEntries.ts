import type { ExactKeyMap } from '../exact-key-map/ExactKeyMap';
import type { Widen } from './Widen';

/**
 * Transforms a nested array of key-value pairs into a structure where nested arrays
 * are converted into `ExactKeyMap` instances, and values are widened to their base types.
 *
 * This utility type recursively processes each entry in the provided array:
 * - If a value is itself an array of key-value pairs, it is transformed into an `ExactKeyMap`.
 * - Otherwise, the value is widened using the `Widen` type.
 *
 * @typeParam E - A readonly array of readonly `[Key, Value]` pairs to be transformed.
 *
 * @example
 * ```typescript
 * type Entries = [
 *   ['name', 'Alice'],
 *   ['details', [
 *     ['age', 30],
 *     ['isActive', true]
 *   ]]
 * ];
 *
 * type Transformed = TransformNestedEntries<Entries>;
 * // Resulting type:
 * // [
 * //   ['name', string],
 * //   ['details', ExactKeyMap<[
 * //     ['age', number],
 * //     ['isActive', boolean]
 * //   ]>]
 * // ]
 * ```
 */
export type TransformNestedEntries<
  E extends readonly (readonly [unknown, unknown])[],
> = {
  [I in keyof E]: E[I] extends readonly [infer K, infer V]
    ? V extends readonly (readonly [unknown, unknown])[]
      ? readonly [K, ExactKeyMap<TransformNestedEntries<V>>]
      : readonly [K, Widen<V>]
    : E[I];
};
