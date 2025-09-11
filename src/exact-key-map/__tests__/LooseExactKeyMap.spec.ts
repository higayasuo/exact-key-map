import { describe, it, expect, expectTypeOf } from 'vitest';
import { LooseExactKeyMap } from '../LooseExactKeyMap';
import { ExactKeyMap } from '../ExactKeyMap';

describe('LooseExactKeyMap', () => {
  describe('fromEntries', () => {
    it('valid: constructs from entries and allows extra keys', () => {
      const m = LooseExactKeyMap.fromEntries([
        ['name', 'Alice'],
        [1, true],
        ['nested', [['x', 1]]],
      ] as const);

      expect(m).toBeInstanceOf(ExactKeyMap);
      expect(m.size).toBe(3);

      expect(m.get('name')).toBe('Alice');
      expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
      expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();

      // known nested key is an ExactKeyMap
      const nested = m.get('nested');
      expect(nested).toBeInstanceOf(ExactKeyMap);

      // extra keys are allowed
      m.set('extraKey', { any: 'value' });
      expect(m.get('extraKey')).toEqual({ any: 'value' });
      expectTypeOf(m.get('extraKey')).toEqualTypeOf<unknown>();
      // runtime check only; compile-time safety verified by overloads
      // extraKey accepts anything
      m.set('extraKey', 123);
      m.set('extraKey', { foo: 'bar' });
      const removed = m.delete('notExists');
      expect(removed).toBe(false);
    });
  });

  describe('withTypes', () => {
    it('valid: constructs empty typed map and allows extra keys', () => {
      const m =
        LooseExactKeyMap.withTypes<
          [['name', string], [1, boolean], ['nested', [['x', number]]]]
        >();

      expect(m).toBeInstanceOf(ExactKeyMap);
      expect(m.size).toBe(0);

      // type safety for defined keys
      m.set('name', 'Alice');

      m.set(1, true);
      expect(m.get('name')).toBe('Alice');
      expect(m.get(1)).toBe(true);
      expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();
      expectTypeOf(m.get(1)).toEqualTypeOf<boolean | undefined>();

      // nested map typing
      const n = LooseExactKeyMap.fromEntries([['x', 1]] as const);
      m.set('nested', n);
      const nested = m.get('nested');
      expect(nested).toBeInstanceOf(ExactKeyMap);

      // extra keys are allowed
      m.set('extra', 123);
      expectTypeOf(m.get('extra')).toEqualTypeOf<unknown>();
      // runtime check only; compile-time safety verified by overloads
      // extraKey accepts anything
      m.set('extraKey', Symbol('x'));
      m.set('extraKey', [1, 2, 3]);
      expect(m.delete('unknown')).toBe(false);
    });
  });
});
