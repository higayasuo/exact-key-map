import { describe, it, expectTypeOf } from 'vitest';
import type { NormalizeValue } from '../NormalizeValue';
import type { ExactKeyMap } from '../../exact-key-map/ExactKeyMap';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExtractExactKeyMapGenerics } from '../ExtractExactKeyMapGenerics';

describe('NormalizeValue', () => {
  it('preserves primitive literal values', () => {
    type S = NormalizeValue<'hello'>;
    type N = NormalizeValue<42>;
    type B = NormalizeValue<true>;
    type U8 = NormalizeValue<Uint8Array>;

    const s = null as unknown as S;
    const n = null as unknown as N;
    const b = null as unknown as B;
    const u8 = null as unknown as U8;

    expectTypeOf(s).toEqualTypeOf<'hello'>();
    expectTypeOf(n).toEqualTypeOf<42>();
    expectTypeOf(b).toEqualTypeOf<true>();
    expectTypeOf(u8).toEqualTypeOf<Uint8Array>();
  });

  it('converts flat entry arrays to ExactKeyMap preserving literals', () => {
    type V = NormalizeValue<[['name', 'Alice'], ['age', 30]]>;

    const v = null as unknown as V;
    expectTypeOf(v).toEqualTypeOf<
      ExactKeyMap<[['name', 'Alice'], ['age', 30]]>
    >();
  });

  it('recursively converts nested entry arrays to nested ExactKeyMap preserving literals', () => {
    type V = NormalizeValue<[['profile', [['id', 1], ['enabled', true]]]]>;

    // Extract entries from the outer ExactKeyMap
    type OuterEntries = ExtractExactKeyMapGenerics<V>;
    // Extract the nested map type for the 'profile' key
    type ProfileMap = ValueOfKey<OuterEntries, 'profile'>;

    const id = null as unknown as ValueOfKey<
      ExtractExactKeyMapGenerics<ProfileMap>,
      'id'
    >;
    const enabled = null as unknown as ValueOfKey<
      ExtractExactKeyMapGenerics<ProfileMap>,
      'enabled'
    >;

    expectTypeOf(id).toEqualTypeOf<1>();
    expectTypeOf(enabled).toEqualTypeOf<true>();
  });

  it('supports deeper nesting levels', () => {
    type V = NormalizeValue<[['a', [['b', [['c', 3]]]]]]>;

    type E1 = ExtractExactKeyMapGenerics<V>;
    type AMap = ValueOfKey<E1, 'a'>;
    type E2 = ExtractExactKeyMapGenerics<AMap>;
    type BMap = ValueOfKey<E2, 'b'>;
    type E3 = ExtractExactKeyMapGenerics<BMap>;

    const c = null as unknown as ValueOfKey<E3, 'c'>;
    expectTypeOf(c).toEqualTypeOf<3>();
  });
});
