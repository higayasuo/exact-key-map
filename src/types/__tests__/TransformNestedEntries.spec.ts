import { describe, it, expectTypeOf } from 'vitest';
import type { TransformNestedEntries } from '../TransformNestedEntries';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExtractExactKeyMapGenerics } from '../ExtractExactKeyMapGenerics';

describe('TransformNestedEntries', () => {
  it('transforms flat entries and widens literal values', () => {
    type E = [['name', 'Alice'], ['age', 30], ['active', true]];

    type T = TransformNestedEntries<E>;

    const name = null as unknown as ValueOfKey<T, 'name'>;
    const age = null as unknown as ValueOfKey<T, 'age'>;
    const active = null as unknown as ValueOfKey<T, 'active'>;
    expectTypeOf(name).toEqualTypeOf<string>();
    expectTypeOf(age).toEqualTypeOf<number>();
    expectTypeOf(active).toEqualTypeOf<boolean>();
  });

  it('converts nested entry arrays into nested ExactKeyMap with widened leaves', () => {
    type E = [['profile', [['id', 1], ['enabled', true]]]];

    type T = TransformNestedEntries<E>;
    type ProfileEntries = ExtractExactKeyMapGenerics<ValueOfKey<T, 'profile'>>;
    const id = null as unknown as ValueOfKey<ProfileEntries, 'id'>;
    const enabled = null as unknown as ValueOfKey<ProfileEntries, 'enabled'>;
    expectTypeOf(id).toEqualTypeOf<number>();
    expectTypeOf(enabled).toEqualTypeOf<boolean>();
  });

  it('supports deep nesting across multiple levels', () => {
    type E = [['a', [['b', [['c', 3]]]]]];

    type T = TransformNestedEntries<E>;
    type Level1 = ExtractExactKeyMapGenerics<ValueOfKey<T, 'a'>>;
    type Level2 = ExtractExactKeyMapGenerics<ValueOfKey<Level1, 'b'>>;
    const c = null as unknown as ValueOfKey<Level2, 'c'>;
    expectTypeOf(c).toEqualTypeOf<number>();
  });
});
