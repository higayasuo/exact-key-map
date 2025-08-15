import { describe, it, expect, expectTypeOf } from 'vitest';
import { ExactKeyMap } from '../ExactKeyMap';

describe('ExactKeyMap', () => {
  describe('runtime behavior', () => {
    it("valid: constructs from exact entries and updates values ('Alice'→'Bob', true→false)", () => {
      const m = new ExactKeyMap([
        ['name', 'Alice'],
        [1, true],
        ['ccc', new Uint8Array([1])],
      ]);

      expect(m).toBeInstanceOf(Map);
      expect(m.size).toBe(3);
      expect(m.get('name')).toBe('Alice');
      expect(m.get(1)).toBe(true);
      expect(m.get('ccc')).toEqual(new Uint8Array([1]));

      m.set('name', 'Bob');
      expect(m.get('name')).toBe('Bob');
      m.set(1, false);
      expect(m.get(1)).toBe(false);
      m.set('ccc', new Uint8Array([2]));
      expect(m.get('ccc')).toEqual(new Uint8Array([2]));
    });
  });

  describe('type-level behavior', () => {
    it("types: get('name') is string|undefined; get(1) is boolean|undefined; get('ccc') is number|undefined", () => {
      const m = new ExactKeyMap([
        ['name', 'Alice'],
        [1, true],
        ['ccc', 1],
      ]);

      expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
      expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();
      expectTypeOf(m.get('ccc')).toEqualTypeOf<number | undefined>();
    });

    it('object keys are allowed', () => {
      const key = new Date();
      const m = new ExactKeyMap([[key, 1]]);

      expectTypeOf(m.get(key)).toEqualTypeOf<number | undefined>();
      expect(m.get(key)).toBe(1);
    });
  });

  describe('nested behavior', () => {
    it('valid: nested entries are converted to ExactKeyMap', () => {
      const m = new ExactKeyMap([
        ['a', 1],
        ['b', 2],
        ['c', [['d', [['e', 3]]]]],
      ]);

      expect(m.get('a')).toBe(1);
      expect(m.get('b')).toBe(2);
      const c = m.get('c');
      expect(c).toBeInstanceOf(ExactKeyMap);
      expectTypeOf(c).toEqualTypeOf<
        ExactKeyMap<readonly [['d', readonly [readonly ['e', 3]]]]> | undefined
      >();
      const d = c?.get('d');
      expect(d).toBeInstanceOf(ExactKeyMap);
      expectTypeOf(d).toEqualTypeOf<
        ExactKeyMap<readonly [['e', number]]> | undefined
      >();
      const e = d?.get('e');
      expect(e).toBe(3);
      expectTypeOf(e).toEqualTypeOf<number | undefined>();
    });
  });
});
