/**
 * Extracts the exact entry tuple from an entries array that matches the given key.
 *
 * This utility type uses TypeScript's `Extract` to find the specific `[Key, Value]`
 * pair from a readonly array of entries where the key matches the provided key `K`.
 *
 * @typeParam Entries - A readonly array of readonly `[Key, Value]` pairs to search through.
 * @typeParam K - The key to match against the first element of each entry tuple.
 *
 * @returns The exact entry tuple `[K, Value]` if found, otherwise `never`.
 *
 * @example
 * ```typescript
 * type Entries = [['name', string], ['age', number], ['active', boolean]];
 * type NameEntry = ExtractExactEntry<Entries, 'name'>; // ['name', string]
 * type AgeEntry = ExtractExactEntry<Entries, 'age'>;   // ['age', number]
 * type InvalidEntry = ExtractExactEntry<Entries, 'invalid'>; // never
 * ```
 */
export type ExtractExactEntry<
  Entries extends readonly (readonly [unknown, unknown])[],
  K,
> = Extract<Entries[number], readonly [K, unknown]>;
