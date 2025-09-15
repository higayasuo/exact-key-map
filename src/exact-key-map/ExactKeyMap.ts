import type { KeysOfEntries } from '@/types/KeysOfEntries';
import type { ValueOfKey } from '@/types/ValueOfKey';
import type { AllValues } from '@/types/AllValues';
import { isArrayOfTuples } from '@/utils/isArrayOfTuples';

/**
 * A type-safe Map implementation that enforces exact key-value type relationships
 * based on a predefined entries structure.
 *
 * This class extends the native `Map` to provide compile-time type safety by:
 * - Constraining keys to only those defined in the original entries
 * - Ensuring values match the exact types associated with their keys
 * - Supporting nested structures by automatically converting nested entry arrays to `ExactKeyMap` instances
 *
 * Prefer using the constructor with union-of-tuples generics for most cases. Use
 * `fromEntries([... ] as const)` only when you specifically want to preserve
 * literal value types at construction time (note: preserved literals restrict
 * later `set` calls to those literals).
 *
 * @typeParam Entries - A readonly array of key-value entry pairs that defines the allowed structure
 *
 * @example
 * ```typescript
 * // Constructor (recommended): union-style generics
 * const map = new ExactKeyMap<[
 *   ['name', string] | ['age', number] | ['isActive', boolean]
 * ]>([
 *   ['name', 'Alice'],
 *   ['age', 30],
 *   ['isActive', true],
 * ]);
 *
 * // Type-safe operations
 * map.set('name', 'Bob');     // ✅ Valid
 * map.set('age', 25);         // ✅ Valid
 * // map.set('name', 123);    // ❌ TypeScript error
 * // map.set('invalid', 'x'); // ❌ TypeScript error
 * ```
 *
 * @example
 * ```typescript
 * // Nested structures are automatically converted to ExactKeyMap instances
 * const nested = new ExactKeyMap<[
 *   [
 *     'user',
 *     [
 *       ['id', number] | ['name', string]
 *     ]
 *   ] | [
 *     'settings',
 *     [
 *       ['theme', string] | ['notifications', boolean]
 *     ]
 *   ]
 * ]>([
 *   ['user', [['id', 1], ['name', 'Alice']]],
 *   ['settings', [['theme', 'dark'], ['notifications', true]]],
 * ]);
 * ```
 */
export class ExactKeyMap<
  Entries extends readonly (readonly [unknown, unknown])[],
> extends Map<KeysOfEntries<Entries>, AllValues<Entries>> {
  /**
   * Creates a new `ExactKeyMap` while preserving literal types from the provided entries.
   *
   * Prefer the constructor for most usage. This factory is useful when you want
   * to preserve literal values at construction time without specifying generics.
   * Note that preserving literals means subsequent `set` calls for those keys
   * must use the same literal types. For mutable values, use the constructor
   * with union-of-tuples generics instead.
   */
  static fromEntries = <
    const E extends readonly (readonly [unknown, unknown])[],
  >(
    entries: E,
  ): ExactKeyMap<E> => {
    return new ExactKeyMap<E>(entries);
  };

  /**
   * Creates a new ExactKeyMap instance from the provided entries.
   *
   * The constructor processes the entries to:
   * - Preserve primitive values as-is
   * - Convert nested entry arrays into nested `ExactKeyMap` instances
   * - Maintain type safety throughout the structure
   *
   * @param entries - The entries array that defines the map's structure and initial values
   *
   * @example
   * ```typescript
   * const map = new ExactKeyMap<[
   *   ['id', number] | ['profile', [
   *     ['name', string] | ['email', string]
   *   ]]
   * ]>([
   *   ['id', 1],
   *   ['profile', [['name', 'Alice'], ['email', 'alice@example.com']]],
   * ]);
   * ```
   */
  constructor(entries?: ReadonlyArray<Entries[number]>) {
    const normalized = (entries ?? []) as ReadonlyArray<Entries[number]>;
    const processed = normalized.map(
      ([key, value]: readonly [unknown, unknown]) => [
        key,
        isArrayOfTuples(value)
          ? new ExactKeyMap(value as readonly (readonly [unknown, unknown])[])
          : value,
      ],
    );

    super(processed as Iterable<[KeysOfEntries<Entries>, AllValues<Entries>]>);
  }

  /**
   * Sets a value for the specified key with full type safety.
   *
   * This method ensures that:
   * - The key must be one of the keys defined in the original entries
   * - The value must match the type expected for that specific key
   * - TypeScript will provide compile-time errors for invalid key-value combinations
   *
   * @typeParam K - The specific key type from the entries (must be a valid key)
   * @param key - The key to set (must be one of the keys from the original entries)
   * @param value - The value to set (must match the type for the specified key)
   * @returns The `ExactKeyMap` instance for method chaining
   *
   * @example
   * ```typescript
   * // Prefer constructor (union-of-tuples generics) for mutable values
   * const map = new ExactKeyMap<[
   *   ['name', string] | ['age', number] | ['isActive', boolean]
   * ]>([
   *   ['name', 'Alice'],
   *   ['age', 30],
   *   ['isActive', true],
   * ]);
   *
   * map.set('name', 'Bob');     // ✅ Valid
   * map.set('age', 25);         // ✅ Valid
   * map.set('isActive', false); // ✅ Valid
   * // map.set('name', 123);    // ❌ TypeScript error
   * // map.set('invalid', 'x'); // ❌ TypeScript error
   *
   * // Note: fromEntries([... ] as const) preserves literal values and will
   * // restrict subsequent set calls to those literals. Use constructor for set examples.
   * ```
   */
  set<K extends KeysOfEntries<Entries>>(
    key: K,
    value: ValueOfKey<Entries, K>,
  ): this {
    return super.set(key, value);
  }

  /**
   * Retrieves a value by key with exact type inference.
   *
   * This method provides:
   * - **Exact Type Inference**: Returns the exact type associated with the specified key
   * - **Type Safety**: The key parameter is constrained to valid keys from the entries
   * - **Undefined Handling**: Returns `undefined` if the key doesn't exist (following Map behavior)
   *
   * @typeParam K - The specific key type from the entries (must be a valid key)
   * @param key - The key to retrieve (must be one of the keys from the original entries)
   * @returns The value associated with the key, or `undefined` if not found
   *
   * @example
   * ```typescript
   * const map = new ExactKeyMap<[
   *   ['name', string] | ['age', number] | ['isActive', boolean]
   * ]>([
   *   ['name', 'Alice'],
   *   ['age', 30],
   *   ['isActive', true],
   * ]);
   *
   * const name = map.get('name');          // string | undefined
   * const age = map.get('age');            // number | undefined
   * const isActive = map.get('isActive');  // boolean | undefined
   * // const invalid = map.get('invalid'); // ❌ TypeScript error
   * ```
   */
  get<K extends KeysOfEntries<Entries>>(
    key: K,
  ): ValueOfKey<Entries, K> | undefined {
    return super.get(key) as ValueOfKey<Entries, K> | undefined;
  }

  /**
   * Removes the specified key and its associated value from the map.
   *
   * This method provides type safety by ensuring only valid keys from the original
   * entries can be deleted. However, note that deletion changes the map structure,
   * which may affect type safety in subsequent operations.
   *
   * @typeParam K - The specific key type from the entries (must be a valid key)
   * @param key - The key to remove (must be one of the keys from the original entries)
   * @returns `true` if the key existed and was removed, `false` if the key didn't exist
   *
   * @example
   * ```typescript
   * const map = new ExactKeyMap<[
   *   ['name', string] | ['age', number]
   * ]>([
   *   ['name', 'Alice'],
   *   ['age', 30],
   * ]);
   *
   * map.delete('name'); // ✅ Valid, returns true
   * map.delete('age');  // ✅ Valid, returns true
   * map.delete('name'); // ✅ Valid, returns false (already deleted)
   * // map.delete('invalid'); // ❌ TypeScript error
   * ```
   */
  delete<K extends KeysOfEntries<Entries>>(key: K): boolean {
    return super.delete(key);
  }
}
