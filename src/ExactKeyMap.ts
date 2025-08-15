import type { KeysOfEntries } from './types/KeysOfEntries';
import type { ValueOfKey } from './types/ValueOfKey';
import type { AllValues } from './types/AllValues';
import { isArrayOfTuples } from './utils/isArrayOfTuples';

/**
 * A strongly-typed `Map` whose keys and values are derived from a readonly
 * tuple/array of `[Key, Value]` pairs. Keys retain their literal types,
 * while value literal primitives are widened to their base primitives.
 *
 * - Nested entry arrays are automatically converted to nested `ExactKeyMap`s.
 */
export class ExactKeyMap<
  const Entries extends readonly (readonly [unknown, unknown])[],
> extends Map<KeysOfEntries<Entries>, AllValues<Entries>> {
  /**
   * Create an `ExactKeyMap` from entries or variadic entry pairs.
   */
  constructor(entries: Entries);
  constructor(...entries: Entries);
  constructor(
    first: Entries | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ) {
    const arr: readonly (readonly [unknown, unknown])[] = Array.isArray(
      first[0],
    )
      ? (first as Entries)
      : [first as [unknown, unknown], ...rest];

    const processed = arr.map(([key, value]) => [
      key,
      isArrayOfTuples(value)
        ? new ExactKeyMap(value as unknown as Entries)
        : value,
    ]);

    super(processed as Iterable<[KeysOfEntries<Entries>, AllValues<Entries>]>);
  }

  /** Update with the original key type and the value type for that key. */
  set<K extends KeysOfEntries<Entries>>(
    key: K,
    value: ValueOfKey<Entries, K>,
  ): this {
    return super.set(key, value);
  }

  /** Get with the original key type, returning the correct value type. */
  get<K extends KeysOfEntries<Entries>>(
    key: K,
  ): ValueOfKey<Entries, K> | undefined {
    return super.get(key) as ValueOfKey<Entries, K> | undefined;
  }
}
