import { describe, it, expect, expectTypeOf } from 'vitest';
import { isTuple } from '../isTuple';

describe('isTuple', () => {
  it('returns true for arrays with exactly 2 elements', () => {
    expect(isTuple([1, 2])).toBe(true);
    expect(isTuple(['a', 'b'])).toBe(true);
    expect(isTuple([true, false])).toBe(true);
    expect(isTuple([null, undefined])).toBe(true);
  });

  it('returns true for nested tuples', () => {
    expect(
      isTuple([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ).toBe(true);
    expect(isTuple([1, [2, 3]])).toBe(true);
    expect(isTuple([[1, 2], 3])).toBe(true);
  });

  it('returns false for arrays with fewer than 2 elements', () => {
    expect(isTuple([])).toBe(false);
    expect(isTuple([1])).toBe(false);
  });

  it('returns false for arrays with more than 2 elements', () => {
    expect(isTuple([1, 2, 3])).toBe(false);
    expect(isTuple(['a', 'b', 'c', 'd'])).toBe(false);
  });

  it('returns false for non-array values', () => {
    expect(isTuple('string')).toBe(false);
    expect(isTuple(123)).toBe(false);
    expect(isTuple(true)).toBe(false);
    expect(isTuple(null)).toBe(false);
    expect(isTuple(undefined)).toBe(false);
    expect(isTuple({})).toBe(false);
    expect(isTuple(() => {})).toBe(false);
  });

  it('works as a type guard', () => {
    const value: unknown = [1, 2];

    if (isTuple(value)) {
      // TypeScript should know value is [unknown, unknown] here
      expectTypeOf(value).toEqualTypeOf<[unknown, unknown]>();
      expect(value[0]).toBe(1);
      expect(value[1]).toBe(2);
      expect(value.length).toBe(2);
    } else {
      expect.fail('isTuple should return true for [1, 2]');
    }
  });
});
