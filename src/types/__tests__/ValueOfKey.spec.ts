import { describe, it, expectTypeOf } from 'vitest';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExactKeyMap } from '../../ExactKeyMap';

describe('ValueOfKey', () => {
  it('extracts widened primitive values', () => {
    type Entries = [['id', 1], ['name', 'foo'], ['active', true]];
    type V1 = ValueOfKey<Entries, 'id'>;
    type V2 = ValueOfKey<Entries, 'name'>;
    type V3 = ValueOfKey<Entries, 'active'>;

    const v1 = null as unknown as V1;
    const v2 = null as unknown as V2;
    const v3 = null as unknown as V3;

    expectTypeOf(v1).toEqualTypeOf<number>();
    expectTypeOf(v2).toEqualTypeOf<string>();
    expectTypeOf(v3).toEqualTypeOf<boolean>();
  });

  it('converts nested entries to ExactKeyMap', () => {
    type Nested = [['child', [['x', 1], ['y', 2]]]];
    type V = ValueOfKey<Nested, 'child'>;

    const v = null as unknown as V;
    expectTypeOf(v).toEqualTypeOf<
      ExactKeyMap<[['x', number], ['y', number]]>
    >();
  });

  it('resolves to never for non-existent keys', () => {
    type Entries = readonly [['a', 1]];
    type V = ValueOfKey<Entries, 'b'>;

    const v = null as unknown as V;
    expectTypeOf(v).toEqualTypeOf<never>();
  });

  it('handles union keys correctly', () => {
    type Entries = readonly [['a', 1], ['b', 2]];
    type V = ValueOfKey<Entries, 'a' | 'b'>;

    const v = null as unknown as V;
    expectTypeOf(v).toEqualTypeOf<number>();
  });
});
