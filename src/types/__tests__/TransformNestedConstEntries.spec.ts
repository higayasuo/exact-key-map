import { describe, it, expectTypeOf } from 'vitest';
import type { TransformNestedConstEntries } from '../TransformNestedConstEntries';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExactKeyMap } from '../../exact-key-map/ExactKeyMap';

describe('TransformNestedConstEntries', () => {
  it('converts nested entry arrays into nested ExactKeyMap with preserved leaves', () => {
    type E = [['profile', [['id', 1], ['enabled', true]]]];

    type T = TransformNestedConstEntries<E>;
    // Leaves remain literal in the nested map
    const actual = null as unknown as ValueOfKey<T, 'profile'>;
    expectTypeOf(actual).toEqualTypeOf<
      ExactKeyMap<[readonly ['id', 1], readonly ['enabled', true]]>
    >();
  });

  it('supports deep nesting across multiple levels with literal preservation', () => {
    type E = [['a', [['b', [['c', 3]]]]]];

    type T = TransformNestedConstEntries<E>;
    // Exact structure is preserved with literal leaf
    const actual = null as unknown as ValueOfKey<T, 'a'>;
    expectTypeOf(actual).toEqualTypeOf<
      ExactKeyMap<[readonly ['b', ExactKeyMap<[readonly ['c', 3]]>]]>
    >();
  });
});
