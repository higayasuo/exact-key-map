import { describe, it, expect, expectTypeOf } from 'vitest';
import { ExactKeyMap } from '../ExactKeyMap';

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

type ProtectedHeadersEntries = (
  | [Headers.Algorithm, number]
  | [Headers.Critical, Headers[]]
  | [Headers.ContentType, number | Uint8Array]
  | [Headers.KeyID, Uint8Array]
  | [
      Exclude<
        Headers,
        | Headers.Algorithm
        | Headers.Critical
        | Headers.ContentType
        | Headers.KeyID
      >,
      Uint8Array | Uint8Array[] | number | number[],
    ]
)[];

class ProtectedHeaders extends ExactKeyMap<ProtectedHeadersEntries> {
  constructor(entries?: ProtectedHeadersEntries) {
    super(entries);
  }
}

describe('ExactKeyMap', () => {
  describe('constructor', () => {
    describe('basic construction and updates', () => {
      it('valid: constructs from entries and supports updates', () => {
        const date = new Date();
        const date2 = new Date(2);
        type Entries = [['name', string] | [1, boolean] | ['ccc', Date]];
        const initialEntries = [
          ['name', 'Alice'],
          [1, true],
          ['ccc', date],
        ] as ReadonlyArray<Entries[number]>;
        const m = new ExactKeyMap<Entries>(initialEntries);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(3);
        expect(m.get('name')).toBe('Alice');
        expect(m.get(1)).toBe(true);
        expect(m.get('ccc')).toEqual(date);

        m.set('name', 'Bob');
        expect(m.get('name')).toBe('Bob');
        m.set(1, false);
        expect(m.get(1)).toBe(false);
        m.set('ccc', date2);
        expect(m.get('ccc')).toEqual(date2);

        // type-checks for the same data
        const ccc = m.get('ccc');
        const nameValue = m.get('name');
        const boolValue = m.get(1);
        expectTypeOf(nameValue).toEqualTypeOf<string | undefined>();
        expectTypeOf(boolValue).toEqualTypeOf<boolean | undefined>();
        expectTypeOf(ccc).toEqualTypeOf<Date | undefined>();
      });

      it('valid: constructs from sub entries array and supports updates', () => {
        const date = new Date();
        const date2 = new Date(2);
        const m = new ExactKeyMap<
          [['name', string] | [1, boolean] | ['ccc', Date]]
        >([
          ['name', 'Alice'],
          ['ccc', date],
        ]);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(2);
        expect(m.get('name')).toBe('Alice');
        expect(m.get('ccc')).toEqual(date);

        m.set('name', 'Bob');
        expect(m.get('name')).toBe('Bob');
        m.set(1, false);
        expect(m.get(1)).toBe(false);
        m.set('ccc', date2);
        expect(m.get('ccc')).toEqual(date2);

        // type-checks for the same data
        const ccc = m.get('ccc');
        const nameValue = m.get('name');
        const boolValue = m.get(1);
        expectTypeOf(nameValue).toEqualTypeOf<string | undefined>();
        expectTypeOf(boolValue).toEqualTypeOf<boolean | undefined>();
        expectTypeOf(ccc).toEqualTypeOf<Date | undefined>();
      });
    });

    describe('constructor without generics', () => {
      it('valid: infers types from entries without generics', () => {
        const m = ExactKeyMap.fromEntries([
          ['name', 'Alice'],
          [1, true],
        ] as const);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(2);
        expect(m.get('name')).toBe('Alice');
        expect(m.get(1)).toBe(true);

        const name = m.get('name');
        const boolValue = m.get(1);
        expectTypeOf(name).toEqualTypeOf<'Alice' | undefined>();
        expectTypeOf(boolValue).toEqualTypeOf<true | undefined>();
      });

      it('valid: constructs empty map without generics', () => {
        const m = new ExactKeyMap();
        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(0);
      });
    });

    describe('typed arrays', () => {
      it('valid: supports Uint8Array values without misclassification', () => {
        const buf1 = new Uint8Array([1, 2, 3]);
        const buf2 = new Uint8Array([4, 5]);
        const m = new ExactKeyMap<[['ccc', Uint8Array]]>([['ccc', buf1]]);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(1);
        expect(m.get('ccc')).toEqual(buf1);

        m.set('ccc', buf2);
        expect(m.get('ccc')).toEqual(buf2);

        const ccc = m.get('ccc');
        expectTypeOf(ccc).toEqualTypeOf<Uint8Array | undefined>();
      });
    });

    describe('nested entries', () => {
      it('valid: nested entries are converted to ExactKeyMap', () => {
        const m = new ExactKeyMap<
          [['a', number] | ['b', number] | ['c', [['d', [['e', number]]]]]]
        >([
          ['a', 1],
          ['b', 2],
          ['c', [['d', [['e', 3]]]]],
        ]);

        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(2);
        const c = m.get('c');
        expect(c).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(c).toEqualTypeOf<
          ExactKeyMap<[['d', ExactKeyMap<[['e', number]]>]]> | undefined
        >();
        const d = c?.get('d');
        expect(d).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(d).toEqualTypeOf<
          ExactKeyMap<[['e', number]]> | undefined
        >();
        const e = d?.get('e');
        expect(e).toBe(3);
        expectTypeOf(e).toEqualTypeOf<number | undefined>();
      });

      it('valid: constructs from nested entries variable (non-inline)', () => {
        type Entries = (
          | ['a', number]
          | ['b', number]
          | ['c', [['d', [['e', number]]]]]
        )[];

        const entries: Entries = [
          ['a', 1],
          ['b', 2],
          ['c', [['d', [['e', 3]]]]],
        ];

        const m = new ExactKeyMap<Entries>(entries);

        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(2);
        const c = m.get('c');
        expect(c).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(c).toEqualTypeOf<
          ExactKeyMap<[['d', ExactKeyMap<[['e', number]]>]]> | undefined
        >();
        const d = c?.get('d');
        expect(d).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(d).toEqualTypeOf<
          ExactKeyMap<[['e', number]]> | undefined
        >();
        const e = d?.get('e');
        expect(e).toBe(3);
        expectTypeOf(e).toEqualTypeOf<number | undefined>();
      });
    });

    describe('delete behavior', () => {
      it("valid: delete('name') returns true and removes the entry; second delete returns false", () => {
        const m = new ExactKeyMap<
          [['name', string] | [1, boolean] | ['ccc', number]]
        >([
          ['name', 'Alice'],
          [1, true],
          ['ccc', 123],
        ]);

        expect(m.size).toBe(3);
        const first = m.delete('name');
        expect(first).toBe(true);
        expect(m.get('name')).toBeUndefined();
        expect(m.size).toBe(2);

        const second = m.delete('name');
        expect(second).toBe(false);
        expect(m.size).toBe(2);
      });

      it('valid: delete on nested map removes nested key', () => {
        const m = new ExactKeyMap<
          [['a', number] | ['b', number] | ['c', [['d', number]]]]
        >([
          ['a', 1],
          ['b', 2],
          ['c', [['d', 3]]],
        ]);

        const c = m.get('c');
        expect(c).toBeInstanceOf(ExactKeyMap);
        const removed = c?.delete('d');
        expect(removed).toBe(true);
        expect(c?.get('d')).toBeUndefined();
      });
    });

    describe('empty construction', () => {
      it('valid: constructs a typed empty ExactKeyMap', () => {
        const m = new ExactKeyMap<[]>([]);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(0);

        expectTypeOf(m).toEqualTypeOf<ExactKeyMap<[]>>();
      });

      it('valid: constructs an empty ExactKeyMap from generics only', () => {
        const m = new ExactKeyMap<
          [['name', string] | [1, boolean] | ['nested', [['x', number]]]]
        >([]);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(0);

        expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
        expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
        const nested = m.get('nested');
        expectTypeOf(nested).toEqualTypeOf<
          ExactKeyMap<[['x', number]]> | undefined
        >();

        m.set('name', 'Alice');
        m.set(1, true);
        expect(m.get('name')).toBe('Alice');
        expect(m.get(1)).toBe(true);

        const n = new ExactKeyMap<[['x', number]]>([['x', 1]]);
        m.set('nested', n);
        expect(m.get('nested')).toBeInstanceOf(ExactKeyMap);
      });
    });

    describe('special cases', () => {
      it('valid: protected headers accepts residual enum keys (Uint8Array values)', () => {
        const headers = new ProtectedHeaders();

        headers.set(Headers.IV, new Uint8Array([0x10, 0x20, 0x30]));
        headers.set(Headers.PartialIV, new Uint8Array([0x40, 0x50, 0x60]));
        headers.set(Headers.X5Bag, new Uint8Array([0x70, 0x80, 0x90]));
        headers.set(Headers.X5T, new Uint8Array([0xa0, 0xb0, 0xc0]));
        headers.set(Headers.X5U, new Uint8Array([0xd0, 0xe0, 0xf0]));

        expect(headers.get(Headers.IV)).toEqual(
          new Uint8Array([0x10, 0x20, 0x30]),
        );
        expect(headers.get(Headers.PartialIV)).toEqual(
          new Uint8Array([0x40, 0x50, 0x60]),
        );
        expect(headers.get(Headers.X5Bag)).toEqual(
          new Uint8Array([0x70, 0x80, 0x90]),
        );
        expect(headers.get(Headers.X5T)).toEqual(
          new Uint8Array([0xa0, 0xb0, 0xc0]),
        );
        expect(headers.get(Headers.X5U)).toEqual(
          new Uint8Array([0xd0, 0xe0, 0xf0]),
        );
      });

      it('valid: sets and gets Headers.IV on ProtectedHeaders', () => {
        const headers = new ProtectedHeaders();

        const iv = new Uint8Array([0x01, 0x02, 0x03]);
        headers.set(Headers.IV, iv);

        expect(headers.get(Headers.IV)).toEqual(iv);

        const ivValue = headers.get(Headers.IV);
        expectTypeOf(ivValue).toEqualTypeOf<
          Uint8Array | Uint8Array[] | number | number[] | undefined
        >();
      });

      it('valid: constructs ProtectedHeaders with Headers.IV via constructor', () => {
        const iv = new Uint8Array([0x01, 0x02, 0x03]);
        const headers = new ProtectedHeaders([[Headers.IV, iv]]);

        expect(headers.get(Headers.IV)).toEqual(iv);

        const ivValue = headers.get(Headers.IV);
        expectTypeOf(ivValue).toEqualTypeOf<
          Uint8Array | Uint8Array[] | number | number[] | undefined
        >();
      });

      it('valid: constructs ProtectedHeaders from variable (non-inline)', () => {
        const entries: ProtectedHeadersEntries = [
          [Headers.IV, new Uint8Array([0x11, 0x22, 0x33])],
          [Headers.KeyID, new Uint8Array([0xaa, 0xbb, 0xcc])],
        ];
        const headers = new ProtectedHeaders(entries);

        expect(headers.get(Headers.IV)).toEqual(
          new Uint8Array([0x11, 0x22, 0x33]),
        );
        expect(headers.get(Headers.KeyID)).toEqual(
          new Uint8Array([0xaa, 0xbb, 0xcc]),
        );
      });
    });
  });
});
