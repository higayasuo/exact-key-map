import { ExactKeyMap } from '../exact-key-map/ExactKeyMap';

/**
 * Extracts the generic type parameter from an `ExactKeyMap`.
 *
 * This utility type checks if `T` is an `ExactKeyMap` and, if so, extracts
 * the type parameter `U` used within the `ExactKeyMap`. If `T` is not an
 * `ExactKeyMap`, it resolves to `never`.
 *
 * @typeParam T - The type to extract the generic parameter from.
 * @returns The extracted generic type parameter if `T` is an `ExactKeyMap`, otherwise `never`.
 */
export type ExtractExactKeyMapGenerics<T> =
  T extends ExactKeyMap<infer U> ? U : never;
