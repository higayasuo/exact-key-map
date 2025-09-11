import { describe, it, expect, expectTypeOf } from 'vitest';
import { ConstExactKeyMap } from '../ConstExactKeyMap';
import { ExactKeyMap } from '../ExactKeyMap';

describe('ConstExactKeyMap', () => {
  describe('fromEntries (array form)', () => {
    it('valid: constructs read-only map and preserves literal entries typing', () => {
      const m = ConstExactKeyMap.fromEntries([
        ['name', 'Alice'],
        ['nested', [['x', 1]]],
      ] as const);

      expect(m).toBeInstanceOf(ExactKeyMap);
      expect(m).toBeInstanceOf(ConstExactKeyMap);
      expect(m.size).toBe(2);

      // get typing: widened value types at the call site
      expectTypeOf(m.get('name')).toEqualTypeOf<string | undefined>();

      const nested = m.get('nested');
      expect(nested).toBeInstanceOf(ExactKeyMap);
      // literal preserved in nested entries
      const expected = null as unknown as
        | ExactKeyMap<readonly [readonly ['x', 1]]>
        | undefined;
      expectTypeOf(nested).toEqualTypeOf(expected);

      // read-only behavior with message checks
      try {
        m.set('name', 'Bob');
        expect.fail('set should throw');
      } catch (e) {
        expect((e as Error).message).toBe(
          'ConstExactKeyMap is read-only, set operation is not allowed',
        );
      }
      try {
        m.delete('name');
        expect.fail('delete should throw');
      } catch (e) {
        expect((e as Error).message).toBe(
          'ConstExactKeyMap is read-only, delete operation is not allowed',
        );
      }

      // nested map is also read-only
      const n = m.get('nested');
      expect(n).toBeInstanceOf(ExactKeyMap);
      try {
        n?.set('x', 2);
        expect.fail('nested.set should throw');
      } catch (e) {
        expect((e as Error).message).toBe(
          'ConstExactKeyMap is read-only, set operation is not allowed',
        );
      }
    });
  });

  describe('fromEntries (variadic form)', () => {
    it('valid: constructs read-only map from variadic pairs', () => {
      const m = ConstExactKeyMap.fromEntries(['id', 1], ['enabled', true]);

      expect(m).toBeInstanceOf(ConstExactKeyMap);
      expect(m.size).toBe(2);
      expectTypeOf(m.get('id')).toEqualTypeOf<number | undefined>();
      expectTypeOf(m.get('enabled')).toEqualTypeOf<boolean | undefined>();
      try {
        m.set('id', 2);
        expect.fail('set should throw');
      } catch (e) {
        expect((e as Error).message).toBe(
          'ConstExactKeyMap is read-only, set operation is not allowed',
        );
      }
      try {
        m.delete('enabled');
        expect.fail('delete should throw');
      } catch (e) {
        expect((e as Error).message).toBe(
          'ConstExactKeyMap is read-only, delete operation is not allowed',
        );
      }
    });
  });
});
