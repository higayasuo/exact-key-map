import type { ExactKeyMap } from '../exact-key-map/ExactKeyMap';

/**
 * Transforms a nested array of key-value pairs into a structure where nested arrays
 * are converted into `ExactKeyMap` instances, preserving literal value types.
 *
 * This utility type recursively processes each entry in the provided array:
 * - If a value is itself an array of key-value pairs, it is transformed into an `ExactKeyMap`.
 * - Otherwise, the value is preserved as-is without widening (unlike `TransformNestedEntries`).
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
 * type Transformed = TransformNestedConstEntries<Entries>;
 * // Resulting type:
 * // [
 * //   ['name', 'Alice'],  // literal preserved, not widened to string
 * //   ['details', ExactKeyMap<[
 * //     ['age', 30],       // literal preserved, not widened to number
 * //     ['isActive', true] // literal preserved, not widened to boolean
 * //   ]>]
 * // ]
 * ```
 */
export type TransformNestedConstEntries<
  E extends readonly (readonly [unknown, unknown])[],
> = {
  [I in keyof E]: E[I] extends readonly [infer K, infer V]
    ? V extends readonly (readonly [unknown, unknown])[]
      ? readonly [K, ExactKeyMap<TransformNestedConstEntries<V>>]
      : readonly [K, V]
    : E[I];
};
