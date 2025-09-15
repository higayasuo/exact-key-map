import type { KeysOfEntries } from '@/types/KeysOfEntries';
import type { ValueOfKey } from '@/types/ValueOfKey';
import type { AllValues } from '@/types/AllValues';
import { isArrayOfTuples } from '@/utils/isArrayOfTuples';
import { TransformNestedEntries } from '@/types/TransformNestedEntries';
// import type { TransformNestedConstEntries } from '@/types/TransformNestedConstEntries';
// import { isEntriesArray } from '@/utils/isEntriesArray';
import { toEntriesArray } from '@/utils/toEntriesArray';
// import type { LooseExactKeyMap } from './LooseExactKeyMap';

/**
 * A strongly-typed `Map` extension that provides exact key typing and automatic
 * nested map conversion. This class extends the native `Map` with enhanced
 * TypeScript support for literal key types and value inference.
 *
 * **Key Features:**
 * - **Exact Key Types**: Keys retain their literal types (e.g., `'name'` stays `'name'`, not `string`)
 * - **Value Widening**: Literal values are automatically widened to their base types
 * - **Nested Support**: Nested entry arrays are automatically converted to nested `ExactKeyMap` instances
 * - **Type Safety**: Full type safety for get/set operations with exact key matching
 *
 * @typeParam Entries - A readonly array of readonly `[Key, Value]` pairs that define the map structure
 *
 * @example
 * ```typescript
 * // Basic usage with exact key types
 * const userMap = ExactKeyMap.fromEntries([
 *   ['name', 'Alice'],
 *   ['age', 30],
 *   ['isActive', true],
 * ]);
 *
 * userMap.get('name');     // string | undefined
 * userMap.set('age', 25);  // ✅ Type-safe
 * userMap.delete('age');   // ✅ Type-safe, returns true
 * // userMap.set('invalid', 'value'); // ❌ TypeScript error
 * ```
 *
 * @example
 * ```typescript
 * // Nested maps are automatically created
 * const config = ExactKeyMap.fromEntries([
 *   ['database', [
 *     ['host', 'localhost'],
 *     ['port', 5432],
 *   ]],
 * ]);
 *
 * const db = config.get('database'); // ExactKeyMap instance
 * const host = db?.get('host');      // string | undefined
 * ```
 */
export class ExactKeyMap<
  const Entries extends readonly (readonly [unknown, unknown])[],
> extends Map<KeysOfEntries<Entries>, AllValues<Entries>> {
  /**
   * Protected constructor for creating `ExactKeyMap` instances.
   *
   * This constructor is protected and should not be called directly.
   * Use the static `fromEntries` method instead to create `ExactKeyMap` instances.
   *
   * The constructor accepts entries in two formats:
   * 1. A single array of `[Key, Value]` pairs
   * 2. Variadic `[Key, Value]` pairs as separate arguments
   *
   * **Nested Processing:**
   * - If any value is an array of tuples (detected by `isArrayOfTuples`), it's automatically
   *   converted to a nested `ExactKeyMap` instance
   * - This allows for hierarchical data structures without manual conversion
   *
   * @param entries - A readonly array of `[Key, Value]` pairs defining the map structure
   *
   * @example
   * ```typescript
   * // Use fromEntries instead of constructor
   * const map = ExactKeyMap.fromEntries([
   *   ['name', 'Alice'],
   *   ['age', 30],
   * ]);
   * ```
   */
  protected constructor(entries: Entries);
  /**
   * Creates a new `ExactKeyMap` instance from variadic entry pairs.
   *
   * @param entries - Variadic `[Key, Value]` pairs as separate arguments
   */
  protected constructor(...entries: Entries);
  protected constructor(
    first: Entries | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ) {
    const arr = toEntriesArray(first, ...rest);

    const processed = arr.map(([key, value]) => [
      key,
      isArrayOfTuples(value)
        ? new ExactKeyMap(value as unknown as Entries)
        : value,
    ]);

    super(processed as Iterable<[KeysOfEntries<Entries>, AllValues<Entries>]>);
  }

  // Entries-based factory that preserves nested ExactKeyMap types for display
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    entries: E,
  ): ExactKeyMap<TransformNestedEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    ...entries: E
  ): ExactKeyMap<TransformNestedEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    first: E | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ): ExactKeyMap<TransformNestedEntries<E>> {
    // Delegate to constructor; overloads provide precise typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ExactKeyMap(first as any, ...rest) as any;
  }

  // fromConstEntries removed; use ConstExactKeyMap.fromEntries instead

  /**
   * Creates an empty `ExactKeyMap` typed purely from generics, without providing any values.
   *
   * Use this when you want a strongly-typed map shape upfront and plan to populate it later.
   * Nested entry arrays in the generic will be transformed to nested `ExactKeyMap` types.
   *
   * @typeParam E - A readonly array of `[Key, Value]` pairs defining the desired map shape
   * @returns An `ExactKeyMap` with the specified type. If no arguments are provided,
   * returns an empty map. You may also pass either a single entries array or variadic
   * entry pairs to initialize the map.
   *
   * @example
   * ```ts
   * const m = ExactKeyMap.withTypes<[
   *   ['name', string],
   *   [1, boolean],
   * ]>();
   *
   * m.set('name', 'Alice'); // type-safe
   * m.get(1);               // boolean | undefined
   * ```
   */
  static withTypes: {
    // Inference from a single entries array
    <const E extends readonly (readonly [unknown, unknown])[]>(
      entries: E,
    ): ExactKeyMap<TransformNestedEntries<E>>;
    // Inference from variadic entries
    <const E extends readonly (readonly [unknown, unknown])[]>(
      ...entries: E
    ): ExactKeyMap<TransformNestedEntries<E>>;
    // Explicit generic with no args
    <const E extends readonly (readonly [unknown, unknown])[]>(): ExactKeyMap<
      TransformNestedEntries<E>
    >;
    // Explicit generic with variadic unknown pairs (args may be subset of generic shape)
    <const E extends readonly (readonly [unknown, unknown])[]>(
      ...entries: readonly [unknown, unknown][]
    ): ExactKeyMap<TransformNestedEntries<E>>;
    // Explicit generic with single entries array (args may be subset of generic shape)
    <const E extends readonly (readonly [unknown, unknown])[]>(
      entries: ReadonlyArray<readonly [unknown, unknown]>,
    ): ExactKeyMap<TransformNestedEntries<E>>;
  } = <const E extends readonly (readonly [unknown, unknown])[]>(
    first?: ReadonlyArray<readonly unknown[]> | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ): ExactKeyMap<TransformNestedEntries<E>> => {
    const arr = first === undefined ? [] : toEntriesArray(first, ...rest);

    // Construct an ExactKeyMap with the target generic shape and initial data.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ExactKeyMap(arr as unknown as E) as any;
  };

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
   * const map = ExactKeyMap.fromEntries([
   *   ['name', 'Alice'],
   *   ['age', 30],
   *   ['isActive', true],
   * ]);
   *
   * map.set('name', 'Bob');     // ✅ Valid
   * map.set('age', 25);         // ✅ Valid
   * map.set('isActive', false); // ✅ Valid
   * // map.set('name', 123);    // ❌ TypeScript error: type 'number' not assignable
   * // map.set('invalid', 'x'); // ❌ TypeScript error: 'invalid' not in keys
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
   * const map = ExactKeyMap.fromEntries([
   *   ['name', 'Alice'],
   *   ['age', 30],
   *   ['isActive', true],
   * ]);
   *
   * const name = map.get('name');     // string | undefined
   * const age = map.get('age');       // number | undefined
   * const isActive = map.get('isActive'); // boolean | undefined
   * const invalid = map.get('invalid');   // ❌ TypeScript error: 'invalid' not in keys
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
   * const map = ExactKeyMap.fromEntries([
   *   ['name', 'Alice'],
   *   ['age', 30],
   * ]);
   *
   * map.delete('name'); // ✅ Valid, returns true
   * map.delete('age');  // ✅ Valid, returns true
   * map.delete('name'); // ✅ Valid, returns false (already deleted)
   * // map.delete('invalid'); // ❌ TypeScript error: 'invalid' not in keys
   * ```
   */
  delete<K extends KeysOfEntries<Entries>>(key: K): boolean {
    return super.delete(key);
  }
}
