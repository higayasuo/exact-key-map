import { describe, it, expectTypeOf } from 'vitest';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExactKeyMap } from '../../exact-key-map/ExactKeyMap';

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

  it('supports catch-all enum keys via Exclude and prefers exact matches', () => {
    enum H {
      Algorithm = 1,
      Critical = 2,
      ContentType = 3,
      KeyID = 4,
      IV = 5,
    }

    type Entries = [
      [H.Algorithm, 1 | 2],
      [H.Critical, H[]],
      [H.ContentType, number | Uint8Array],
      [H.KeyID, Uint8Array],
      [
        Exclude<H, H.Algorithm | H.Critical | H.ContentType | H.KeyID>,
        Uint8Array | Uint8Array[] | number | number[],
      ],
    ];

    type VIV = ValueOfKey<Entries, H.IV>;
    type VCT = ValueOfKey<Entries, H.ContentType>;

    const viv = null as unknown as VIV;
    const vct = null as unknown as VCT;

    expectTypeOf(viv).toEqualTypeOf<
      Uint8Array | Uint8Array[] | number | number[]
    >();
    expectTypeOf(vct).toEqualTypeOf<number | Uint8Array>();
  });
});
