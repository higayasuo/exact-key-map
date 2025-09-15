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

const createProtectedHeaders = (): ExactKeyMap<ProtectedHeadersEntries> =>
  new ExactKeyMap<ProtectedHeadersEntries>();

describe('ExactKeyMap', () => {
  describe('constructor', () => {
    describe('basic construction and updates', () => {
      it('valid: constructs from entries and supports updates', () => {
        const date = new Date();
        const date2 = new Date(2);
        const m = new ExactKeyMap<
          [['name', string] | [1, boolean] | ['ccc', Date]]
        >([
          ['name', 'Alice'],
          [1, true],
          ['ccc', date],
        ]);

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

    describe('withTypes', () => {
      describe('data input', () => {
        it('valid: withTypes accepts a single entries array', () => {
          const m = new ExactKeyMap<[['name', string] | [1, boolean]]>([
            ['name', 'Alice'],
            [1, true],
          ]);

          expect(m).toBeInstanceOf(ExactKeyMap);
          expect(m.size).toBe(2);
          expect(m.get('name')).toBe('Alice');
          expect(m.get(1)).toBe(true);

          expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
          expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
        });

        it("valid: union [['aaa', number] | [string, string]] prioritizes exact key 'aaa'", () => {
          const m = new ExactKeyMap<[['aaa', number] | [string, string]]>([
            ['aaa', 1],
            ['name', 'Alice'],
          ]);

          expect(m.get('aaa')).toBe(1);
          expect(m.get('name')).toBe('Alice');

          const vAaa = m.get('aaa');
          const vOther = m.get('name');
          expectTypeOf(vAaa).toEqualTypeOf<number | undefined>();
          expectTypeOf(vOther).toEqualTypeOf<string | undefined>();

          m.set('aaa', 2);
          m.set('name', 'Bob');
          expect(m.get('aaa')).toBe(2);
          expect(m.get('name')).toBe('Bob');
        });

        it('valid: withTypes accepts variadic pairs (including nested)', () => {
          const m = new ExactKeyMap<
            [['a', number] | ['b', number] | ['nested', [['x', number]]]]
          >([
            ['a', 1],
            ['b', 2],
            ['nested', [['x', 3]]],
          ]);

          expect(m).toBeInstanceOf(ExactKeyMap);
          expect(m.size).toBe(3);
          expect(m.get('a')).toBe(1);
          expect(m.get('b')).toBe(2);

          const nested = m.get('nested');
          expect(nested).toBeInstanceOf(ExactKeyMap);
          const nestedForType = nested;
          expectTypeOf(nestedForType).toEqualTypeOf<
            ExactKeyMap<[['x', number]]> | undefined
          >();
          const x = nested?.get('x');
          expect(x).toBe(3);
          expectTypeOf(x).toEqualTypeOf<number | undefined>();
        });

        it('valid: withTypes supports generics richer than provided args (set later)', () => {
          const m = new ExactKeyMap<
            [['name', string] | [1, boolean] | ['nested', [['x', number]]]]
          >([
            ['name', 'Alice'],
            ['nested', [['x', 3]]],
          ]);

          expect(m).toBeInstanceOf(ExactKeyMap);
          expect(m.size).toBe(2);
          expect(m.get('name')).toBe('Alice');

          const nested = m.get('nested');
          expect(nested).toBeInstanceOf(ExactKeyMap);
          expectTypeOf(nested).toEqualTypeOf<
            ExactKeyMap<[['x', number]]> | undefined
          >();
          const x = nested?.get('x');
          expect(x).toBe(3);
          expectTypeOf(x).toEqualTypeOf<number | undefined>();

          // Missing key from generics can be set later
          m.set(1, false);
          expect(m.get(1)).toBe(false);
          expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
        });

        describe('generics only', () => {
          it('valid: constructs an empty ExactKeyMap from generics only', () => {
            const m = new ExactKeyMap<
              [['name', string] | [1, boolean] | ['nested', [['x', number]]]]
            >();

            expect(m).toBeInstanceOf(ExactKeyMap);
            expect(m.size).toBe(0);

            // Keys and values should be enforced by the generic
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

            const n = new ExactKeyMap<[['x', number]]>();
            n.set('x', 1);
            m.set('nested', n);
            expect(m.get('nested')).toBeInstanceOf(ExactKeyMap);
          });
        });

        describe('literals', () => {
          it("valid: supports literal key and literal value types like ['aaa', 'alice']", () => {
            const m = new ExactKeyMap<[['aaa', 'alice']]>([['aaa', 'alice']]);

            expect(m).toBeInstanceOf(ExactKeyMap);
            expect(m.size).toBe(1);
            expect(m.get('aaa')).toBe('alice');

            const v = m.get('aaa');
            expectTypeOf(v).toEqualTypeOf<'alice' | undefined>();

            m.set('aaa', 'alice');
            expect(m.get('aaa')).toBe('alice');
          });

          it('valid: supports literal key with numeric literal value', () => {
            const m = new ExactKeyMap<[['bbb', 123]]>([['bbb', 123]]);

            expect(m.get('bbb')).toBe(123);
            const v = m.get('bbb');
            expectTypeOf(v).toEqualTypeOf<123 | undefined>();

            m.set('bbb', 123);
            expect(m.get('bbb')).toBe(123);
          });

          it("valid: supports union of literal values like ['color', 'red' | 'blue']", () => {
            const m = new ExactKeyMap<[['color', 'red' | 'blue']]>([
              ['color', 'red'],
            ]);

            const v1 = m.get('color');
            expectTypeOf(v1).toEqualTypeOf<'red' | 'blue' | undefined>();

            m.set('color', 'blue');
            const v2 = m.get('color');
            expectTypeOf(v2).toEqualTypeOf<'red' | 'blue' | undefined>();
            expect(v2).toBe('blue');
          });

          it('valid: nested entries can use literal values', () => {
            const m = new ExactKeyMap<[['nested', [['k', 'id']]]]>([
              ['nested', [['k', 'id']]],
            ]);

            const nested = m.get('nested');
            expect(nested).toBeInstanceOf(ExactKeyMap);
            const v = nested?.get('k');
            expect(v).toBe('id');
            expectTypeOf(v).toEqualTypeOf<'id' | undefined>();
          });
        });

        describe('special cases', () => {
          it('valid: protected headers accepts residual enum keys (Uint8Array values)', () => {
            const headers = createProtectedHeaders();

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
        });
      });

      describe('special cases', () => {
        it('valid: protected headers accepts residual enum keys (Uint8Array values)', () => {
          const headers = createProtectedHeaders();

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
      });
    });
  });
});
