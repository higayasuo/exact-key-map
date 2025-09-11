import { describe, it, expect, expectTypeOf } from 'vitest';
import { ExactKeyMap } from '../ExactKeyMap';

describe('ExactKeyMap', () => {
  describe('fromEntries', () => {
    describe('basic construction and updates', () => {
      it('valid: constructs from entries and supports updates', () => {
        const date = new Date();
        const date2 = new Date(2);
        const m = ExactKeyMap.fromEntries([
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
        expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
        expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
        expectTypeOf(ccc).toEqualTypeOf<Date | undefined>();
      });
    });

    describe('typed arrays', () => {
      it('valid: supports Uint8Array values without misclassification', () => {
        const buf1 = new Uint8Array([1, 2, 3]);
        const buf2 = new Uint8Array([4, 5]);
        const m = ExactKeyMap.fromEntries([['ccc', buf1]]);

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
        const m = ExactKeyMap.fromEntries([
          ['a', 1],
          ['b', 2],
          ['c', [['d', [['e', 3]]]]],
        ]);

        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(2);
        const c = m.get('c');
        expect(c).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(c).toEqualTypeOf<
          | ExactKeyMap<
              readonly [
                readonly ['d', ExactKeyMap<readonly [readonly ['e', number]]>],
              ]
            >
          | undefined
        >();
        const d = c?.get('d');
        expect(d).toBeInstanceOf(ExactKeyMap);
        expectTypeOf(d).toEqualTypeOf<
          ExactKeyMap<readonly [readonly ['e', number]]> | undefined
        >();
        const e = d?.get('e');
        expect(e).toBe(3);
        expectTypeOf(e).toEqualTypeOf<number | undefined>();
      });
    });

    describe('delete behavior', () => {
      it("valid: delete('name') returns true and removes the entry; second delete returns false", () => {
        const m = ExactKeyMap.fromEntries([
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
        const m = ExactKeyMap.fromEntries([
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
        const m = ExactKeyMap.fromEntries([] as const);

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(0);

        // Type-level assertion: an empty entries array yields ExactKeyMap<readonly []>
        expectTypeOf(m).toEqualTypeOf<ExactKeyMap<readonly []>>();
      });

      it('valid: constructs an empty ExactKeyMap from generics only', () => {
        const m =
          ExactKeyMap.withTypes<
            [['name', string], [1, boolean], ['nested', [['x', number]]]]
          >();

        expect(m).toBeInstanceOf(ExactKeyMap);
        expect(m.size).toBe(0);

        // Keys and values should be enforced by the generic
        expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
        expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
        const nested = m.get('nested');
        expectTypeOf(nested).toEqualTypeOf<
          ExactKeyMap<[readonly ['x', number]]> | undefined
        >();

        m.set('name', 'Alice');
        m.set(1, true);
        expect(m.get('name')).toBe('Alice');
        expect(m.get(1)).toBe(true);

        const n = ExactKeyMap.withTypes<[['x', number]]>();
        n.set('x', 1);
        m.set('nested', n);
        expect(m.get('nested')).toBeInstanceOf(ExactKeyMap);
      });
    });
  });
});
