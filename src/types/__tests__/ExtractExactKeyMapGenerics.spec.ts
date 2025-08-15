import { describe, it, expectTypeOf } from 'vitest';
import type { ExtractExactKeyMapGenerics } from '../ExtractExactKeyMapGenerics';
import type { ExactKeyMap } from '../../ExactKeyMap';

describe('ExtractExactKeyMapGenerics', () => {
  it('extracts entries from ExactKeyMap', () => {
    type Entries = readonly [readonly ['a', number], readonly ['b', string]];
    type M = ExactKeyMap<Entries>;
    type G = ExtractExactKeyMapGenerics<M>;

    const g = null as unknown as G;
    expectTypeOf(g).toEqualTypeOf<Entries>();
  });

  it('returns never for non-ExactKeyMap', () => {
    type G = ExtractExactKeyMapGenerics<number>;
    const g = null as unknown as G;
    expectTypeOf(g).toEqualTypeOf<never>();
  });

  it('preserves nested ExactKeyMap types inside entries', () => {
    type ChildEntries = readonly [readonly ['x', number]];
    type Child = ExactKeyMap<ChildEntries>;
    type OuterEntries = readonly [readonly ['child', Child]];
    type Outer = ExactKeyMap<OuterEntries>;
    type G = ExtractExactKeyMapGenerics<Outer>;

    const g = null as unknown as G;
    expectTypeOf(g).toEqualTypeOf<OuterEntries>();
  });
});
