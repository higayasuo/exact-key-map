import type { ExactKeyMap } from '../exact-key-map/ExactKeyMap';
import { LastInUnion } from './LastInUnion';

/**
 * Converts a plain object type to the entry-pair format expected by ExactKeyMap.
 * The result is a readonly tuple of readonly `[Key, Value]` pairs.
 *
 * Nested plain objects are recursively converted to `ExactKeyMap` of their
 * own entry pairs.
 *
 * Note: Tuple element order follows TypeScript's union-to-tuple mechanics and
 * is not guaranteed to reflect source declaration order.
 */

// Drop index signatures, keep only known literal keys
type KnownKeys<T> = keyof {
  [K in keyof T as K extends string
    ? string extends K
      ? never
      : K
    : K extends number
      ? number extends K
        ? never
        : K
      : K extends symbol
        ? symbol extends K
          ? never
          : K
        : never]: unknown;
};

// Detect plain object-like (not functions, not arrays/tuples, not built-ins with index signatures)
type IsPlainObject<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? false
    : T extends readonly unknown[]
      ? false
      : string extends keyof T
        ? false
        : number extends keyof T
          ? false
          : symbol extends keyof T
            ? false
            : true
  : false;

type ConvertValue<V> =
  IsPlainObject<V> extends true ? ExactKeyMap<ObjectToExactKeyMap<V>> : V;

type AsReadonlyArray<T> = T extends readonly unknown[] ? T : readonly [];

type BuildEntries<
  TObject,
  KeyTuple extends readonly unknown[],
> = KeyTuple extends readonly [infer K, ...infer Rest]
  ? K extends keyof TObject
    ? readonly [
        readonly [K, ConvertValue<TObject[K]>],
        ...BuildEntries<TObject, AsReadonlyArray<Rest>>,
      ]
    : BuildEntries<TObject, AsReadonlyArray<Rest>>
  : readonly [];

type UnionToTuple<U, R extends unknown[] = []> = [U] extends [never]
  ? R
  : UnionToTuple<Exclude<U, LastInUnion<U>>, [...R, LastInUnion<U>]>;

// Build readonly tuple of readonly [K, V] entries
export type ObjectToExactKeyMap<T> =
  UnionToTuple<KnownKeys<T>> extends infer KS
    ? KS extends readonly unknown[]
      ? BuildEntries<T, KS>
      : readonly []
    : readonly [];
