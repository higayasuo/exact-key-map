import { describe, it, expect, expectTypeOf } from 'vitest';
import { isArrayOfTuples } from '../isArrayOfTuples';

describe('isArrayOfTuples', () => {
  it('returns true for arrays of valid entry tuples', () => {
    expect(
      isArrayOfTuples([
        ['name', 'Alice'],
        [1, true],
      ]),
    ).toBe(true);
    expect(
      isArrayOfTuples([
        ['key', 'value'],
        ['anotherKey', 42],
      ]),
    ).toBe(true);
    expect(
      isArrayOfTuples([
        ['string', 'value'],
        [123, 'number'],
        [Symbol('sym'), {}],
      ]),
    ).toBe(true);
  });

  it('returns true for empty arrays', () => {
    expect(isArrayOfTuples([])).toBe(true);
  });

  it('returns false for arrays with non-tuple elements', () => {
    expect(isArrayOfTuples(['not-a-tuple'])).toBe(false);
    expect(isArrayOfTuples([{ key: 'value' }])).toBe(false);
    expect(isArrayOfTuples([null, undefined])).toBe(false);
    expect(isArrayOfTuples([1, 2, 3])).toBe(false);
  });

  it('returns false for mixed arrays with some non-tuples', () => {
    expect(isArrayOfTuples([['key', 'value'], 'not-a-tuple'])).toBe(false);
    expect(isArrayOfTuples([['key', 'value'], { key: 'value' }])).toBe(false);
  });

  it('returns false for non-array values', () => {
    expect(isArrayOfTuples('string')).toBe(false);
    expect(isArrayOfTuples(123)).toBe(false);
    expect(isArrayOfTuples(true)).toBe(false);
    expect(isArrayOfTuples(null)).toBe(false);
    expect(isArrayOfTuples(undefined)).toBe(false);
    expect(isArrayOfTuples({})).toBe(false);
    expect(isArrayOfTuples(() => {})).toBe(false);
  });

  it('works as a type guard', () => {
    const value: unknown = [
      ['name', 'Alice'],
      [1, true],
    ];

    if (isArrayOfTuples(value)) {
      // TypeScript should know value is Array<[PropertyKey, unknown]> here
      expectTypeOf(value).toEqualTypeOf<Array<[PropertyKey, unknown]>>();
      expect(value[0][0]).toBe('name');
      expect(value[0][1]).toBe('Alice');
      expect(value[1][0]).toBe(1);
      expect(value[1][1]).toBe(true);
    } else {
      expect.fail('isArrayOfTuples should return true for valid entry tuples');
    }
  });

  it('handles nested tuples correctly', () => {
    expect(isArrayOfTuples([['config', [['debug', true]]]])).toBe(true);
    expect(
      isArrayOfTuples([
        [
          'nested',
          [
            ['a', 1],
            ['b', 2],
          ],
        ],
      ]),
    ).toBe(true);
  });
});
