import { describe, it, expectTypeOf } from 'vitest';
import type { TransformNestedEntries } from '../TransformNestedEntries';
import type { ValueOfKey } from '../ValueOfKey';
import { ExactKeyMap } from '../../exact-key-map/ExactKeyMap';

// Local test model for COSE protected headers using numeric enum labels
// The last entry covers all remaining header labels using Exclude

enum Headers {
  Algorithm = 1,
  Critical = 2,
  ContentType = 3,
  KeyID = 4,
  IV = 5,
  PartialIV = 6,
  CounterSignature = 7,
  CounterSignature0 = 9,
  CounterSignatureV2 = 11,
  CounterSignature0V2 = 12,
  X5Bag = 32,
  X5Chain = 33,
  X5T = 34,
  X5U = 35,
}

type Algorithms = 1 | 2;

// Pattern under test (mirrors the user's described structure)
// Note: Exclude is used for the catch-all entry because the keys are a numeric enum
export type ProtectedHeadersEntries = [
  [Headers.Algorithm, Algorithms],
  [Headers.Critical, Headers[]],
  [Headers.ContentType, number | Uint8Array],
  [Headers.KeyID, Uint8Array],
  [
    Exclude<
      Headers,
      Headers.Algorithm | Headers.Critical | Headers.ContentType | Headers.KeyID
    >,
    Uint8Array | Uint8Array[] | number | number[],
  ],
];

describe('TransformNestedEntries - protected headers pattern (numeric enum keys)', () => {
  it('transforms entries and widens values appropriately', () => {
    type T = TransformNestedEntries<ProtectedHeadersEntries>;

    const alg = null as unknown as ValueOfKey<T, Headers.Algorithm>;
    const crit = null as unknown as ValueOfKey<T, Headers.Critical>;
    const cty = null as unknown as ValueOfKey<T, Headers.ContentType>;
    const kid = null as unknown as ValueOfKey<T, Headers.KeyID>;
    type Others = Exclude<
      Headers,
      Headers.Algorithm | Headers.Critical | Headers.ContentType | Headers.KeyID
    >;
    const other = null as unknown as ValueOfKey<T, Others>;

    expectTypeOf(alg).toEqualTypeOf<number>();
    expectTypeOf(crit).toEqualTypeOf<number[]>();
    expectTypeOf(cty).toEqualTypeOf<number | Uint8Array>();
    expectTypeOf(kid).toEqualTypeOf<Uint8Array>();
    expectTypeOf(other).toEqualTypeOf<
      Uint8Array | Uint8Array[] | number | number[]
    >();
  });

  it('works with ExactKeyMap.withTypes factory for known and residual keys', () => {
    const map = ExactKeyMap.withTypes<ProtectedHeadersEntries>();

    map.set(Headers.Algorithm, 2 as Algorithms);
    map.set(Headers.Critical, [Headers.Algorithm] as Headers[]);
    map.set(Headers.ContentType, 100);
    map.set(Headers.ContentType, new Uint8Array());
    map.set(Headers.KeyID, new Uint8Array());

    // Residual headers via Exclude should be accepted
    map.set(Headers.IV, new Uint8Array([0x10, 0x20, 0x30]));
    map.set(Headers.PartialIV, new Uint8Array([0x40, 0x50, 0x60]));
    map.set(Headers.X5Bag, new Uint8Array([0x70, 0x80, 0x90]));
    map.set(Headers.X5T, new Uint8Array([0xa0, 0xb0, 0xc0]));
    map.set(Headers.X5U, new Uint8Array([0xd0, 0xe0, 0xf0]));

    type T = TransformNestedEntries<ProtectedHeadersEntries>;
    type Others = Exclude<
      Headers,
      Headers.Algorithm | Headers.Critical | Headers.ContentType | Headers.KeyID
    >;
    const other = null as unknown as ValueOfKey<T, Others>;
    expectTypeOf(other).toEqualTypeOf<
      Uint8Array | Uint8Array[] | number | number[]
    >();
  });
});
