/**
 * Extracts the union of key types from a readonly tuple/array of entry pairs.
 *
 * Given an `Entries` type shaped as a readonly array (or tuple) of
 * readonly `[Key, Value]` pairs, this utility resolves to a union of all
 * `Key` types present in the entries.
 *
 * - Input shape: `readonly (readonly [K, V])[]`
 * - Output type: `K`
 *
 * @typeParam Entries - A readonly list of readonly `[Key, Value]` pairs.
 * @example
 *   type Entries = readonly [["id", number], ["name", string]];
 *   type Keys = KeysOfEntries<Entries>; // "id" | "name"
 *
 * @example
 *   const entries = Object.entries({ a: 1, b: 2 }) as const;
 *   type Keys = KeysOfEntries<typeof entries>; // "a" | "b"
 */
export type KeysOfEntries<
  Entries extends readonly (readonly [unknown, unknown])[],
> = Entries[number] extends readonly [infer K, any] ? K : never;
