import type { ExactKeyMap } from '../ExactKeyMap';

/**
 * Converts a plain object type to the entry-pair format expected by ExactKeyMap.
 * The result is order-agnostic: a readonly array whose element type is the
 * union of readonly `[Key, Value]` pairs for all known (non-index) keys.
 *
 * Nested plain objects are recursively converted to `ExactKeyMap` of their
 * own entry pairs.
 *
 * @typeParam T - The object type to convert
 * @returns A readonly array type of `[Key, Value]` pairs (order not guaranteed)
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

type EntryUnion<T> = [KnownKeys<T>] extends [never]
  ? never
  : KnownKeys<T> extends infer K
    ? K extends keyof T
      ? readonly [K, ConvertValue<T[K]>]
      : never
    : never;

export type ObjectToExactKeyMap<T> = [KnownKeys<T>] extends [never]
  ? readonly []
  : readonly EntryUnion<T>[];
