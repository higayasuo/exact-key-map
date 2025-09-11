import type { KeysOfEntries } from '@/types/KeysOfEntries';
import type { ValueOfKey } from '@/types/ValueOfKey';
import { ExactKeyMap } from './ExactKeyMap';
import type { TransformNestedEntries } from '@/types/TransformNestedEntries';

/**
 * A variant of `ExactKeyMap` used by `withTypes` that keeps defined keys
 * type-safe while allowing additional, undefined keys to be set, retrieved,
 * and deleted.
 */
export class LooseExactKeyMap<
  const Entries extends readonly (readonly [unknown, unknown])[],
> extends ExactKeyMap<Entries> {
  // Entries-based factory mirroring ExactKeyMap typing, returning a permissive instance type
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    entries: E,
  ): LooseExactKeyMap<TransformNestedEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    ...entries: E
  ): LooseExactKeyMap<TransformNestedEntries<E>>;
  static fromEntries<const E extends readonly (readonly [unknown, unknown])[]>(
    first: E | readonly [unknown, unknown],
    ...rest: readonly [unknown, unknown][]
  ): LooseExactKeyMap<TransformNestedEntries<E>> {
    // Delegate to ExactKeyMap constructor; cast to permissive interface for ergonomics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ExactKeyMap(first as any, ...rest) as any;
  }

  /**
   * Creates an empty `LooseExactKeyMap` typed purely from generics.
   */
  static withTypes = <
    const E extends readonly (readonly [unknown, unknown])[],
  >(): LooseExactKeyMap<TransformNestedEntries<E>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ExactKeyMap([] as unknown as E) as any;
  };
  /**
   * Initializes an empty map with the target type.
   */
  protected constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super([] as unknown as any);
  }

  // set: defined keys type-safe; other keys accept any value
  set<K extends KeysOfEntries<Entries>>(
    key: K,
    value: ValueOfKey<Entries, K>,
  ): this;
  set<K extends Exclude<PropertyKey, KeysOfEntries<Entries>>>(
    key: K,
    value: unknown,
  ): this;
  set(key: PropertyKey, value: unknown): this {
    return super.set(key as never, value as never);
  }

  // get: precise type for known keys, unknown for others
  get<K extends KeysOfEntries<Entries>>(
    key: K,
  ): ValueOfKey<Entries, K> | undefined;
  get<K extends Exclude<PropertyKey, KeysOfEntries<Entries>>>(key: K): unknown;
  get(key: PropertyKey): unknown {
    return super.get(key as never);
  }

  // delete: allow deleting both known and unknown keys
  delete<K extends KeysOfEntries<Entries>>(key: K): boolean;
  delete<K extends Exclude<PropertyKey, KeysOfEntries<Entries>>>(
    key: K,
  ): boolean;
  delete(key: PropertyKey): boolean {
    return super.delete(key as never);
  }
}
