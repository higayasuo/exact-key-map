import type { KeysOfEntries } from '@/types/KeysOfEntries';
import type { ValueOfKey } from '@/types/ValueOfKey';
import type { TransformNestedConstEntries } from '@/types/TransformNestedConstEntries';
import { toEntriesArray } from '@/utils/toEntriesArray';
import { isArrayOfTuples } from '@/utils/isArrayOfTuples';
import { ExactKeyMap } from './ExactKeyMap';

/**
 * Read-only variant of ExactKeyMap used by fromConstEntries.
 * - Preserves literal types (paired with TransformNestedConstEntries at call site)
 * - Throws on set and delete
 */
export class ConstExactKeyMap<
  const Entries extends readonly (readonly [unknown, unknown])[],
> extends ExactKeyMap<Entries> {
  private _constructing = false;
  // Entries-based factory (preserves literal types at call sites via TransformNestedConstEntries)
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    entries: E,
  ): ConstExactKeyMap<TransformNestedConstEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    ...entries: E
  ): ConstExactKeyMap<TransformNestedConstEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    first: E | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ): ConstExactKeyMap<TransformNestedConstEntries<E>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ConstExactKeyMap(first, ...rest) as any;
  }

  protected constructor(
    first: Entries | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ) {
    // Create empty base map, then populate to avoid calling overridden set during super()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super([] as any);
    this._constructing = true;
    const arr = toEntriesArray(first, ...rest);
    const processed = arr.map(([key, value]) => [
      key,
      isArrayOfTuples(value)
        ? new ConstExactKeyMap(value as unknown as Entries)
        : value,
    ]) as Array<readonly [unknown, unknown]>;
    for (const [k, v] of processed) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      super.set(k as any, v as any);
    }
    this._constructing = false;
  }

  override set<K extends KeysOfEntries<Entries>>(
    _key: K,
    _value: ValueOfKey<Entries, K>,
  ): this {
    if (this._constructing) {
      // During construction, Map constructor calls set; allow it
      return super.set(_key, _value);
    }
    throw new Error(
      'ConstExactKeyMap is read-only, set operation is not allowed',
    );
  }

  override delete<K extends KeysOfEntries<Entries>>(_key: K): boolean {
    if (this._constructing) {
      return super.delete(_key);
    }
    throw new Error(
      'ConstExactKeyMap is read-only, delete operation is not allowed',
    );
  }
}
