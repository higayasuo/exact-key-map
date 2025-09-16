import { describe, it, expect, expectTypeOf } from 'vitest';
import { isEntry } from '../isEntry';
import type { Entry } from '@/types/Entry';

describe('isEntry', () => {
  it('returns true for arrays with exactly 2 elements', () => {
    expect(isEntry([1, 2])).toBe(true);
    expect(isEntry(['a', 'b'])).toBe(true);
    expect(isEntry([true, false])).toBe(true);
    expect(isEntry([null, undefined])).toBe(true);
  });

  it('returns true for nested entries', () => {
    expect(
      isEntry([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ).toBe(true);
    expect(isEntry([1, [2, 3]])).toBe(true);
    expect(isEntry([[1, 2], 3])).toBe(true);
  });

  it('returns false for arrays with fewer than 2 elements', () => {
    expect(isEntry([])).toBe(false);
    expect(isEntry([1])).toBe(false);
  });

  it('returns false for arrays with more than 2 elements', () => {
    expect(isEntry([1, 2, 3])).toBe(false);
    expect(isEntry(['a', 'b', 'c', 'd'])).toBe(false);
  });

  it('returns false for non-array values', () => {
    expect(isEntry('string')).toBe(false);
    expect(isEntry(123)).toBe(false);
    expect(isEntry(true)).toBe(false);
    expect(isEntry(null)).toBe(false);
    expect(isEntry(undefined)).toBe(false);
    expect(isEntry({})).toBe(false);
    expect(isEntry(() => {})).toBe(false);
  });

  it('works as a type guard', () => {
    const value: unknown = [1, 2];

    if (isEntry(value)) {
      // TypeScript should know value is Entry here (readonly tuple)
      expectTypeOf(value).toEqualTypeOf<Entry>();
      expect(value[0]).toBe(1);
      expect(value[1]).toBe(2);
      expect(value.length).toBe(2);
    } else {
      expect.fail('isEntry should return true for [1, 2]');
    }
  });
});
