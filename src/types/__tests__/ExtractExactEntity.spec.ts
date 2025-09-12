import { describe, it, expectTypeOf } from 'vitest';
import type { ExtractExactEntry } from '../ExtractExactEntity';

describe('ExtractExactEntry', () => {
  it('extracts the exact entry for a present string key', () => {
    type Entries = [['name', string], ['age', number], ['active', boolean]];

    const nameEntry = null as unknown as ExtractExactEntry<Entries, 'name'>;
    const ageEntry = null as unknown as ExtractExactEntry<Entries, 'age'>;

    expectTypeOf(nameEntry).toEqualTypeOf<['name', string]>();
    expectTypeOf(ageEntry).toEqualTypeOf<['age', number]>();
  });

  it('returns never for a missing key', () => {
    type Entries = [['a', number]];

    const invalid = null as unknown as ExtractExactEntry<Entries, 'b'>;
    expectTypeOf(invalid).toEqualTypeOf<never>();
  });

  it('distributes over union keys and returns a union of matching entries', () => {
    type Entries = [['name', string], ['age', number], ['active', boolean]];

    const unionEntry = null as unknown as ExtractExactEntry<
      Entries,
      'name' | 'active'
    >;

    expectTypeOf(unionEntry).toEqualTypeOf<
      ['name', string] | ['active', boolean]
    >();
  });

  it('works with numeric keys', () => {
    type Entries = [[1, string], [2, number]];

    const e1 = null as unknown as ExtractExactEntry<Entries, 1>;
    const e2 = null as unknown as ExtractExactEntry<Entries, 2>;

    expectTypeOf(e1).toEqualTypeOf<[1, string]>();
    expectTypeOf(e2).toEqualTypeOf<[2, number]>();
  });
});
