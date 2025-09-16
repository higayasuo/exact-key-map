import { describe, it, expect, expectTypeOf } from 'vitest';
import { isEntries } from '../isEntities';
import type { Es } from '@/types/Es';
import type { Entry } from '@/types/Entry';

describe('isEntries', () => {
  it('returns true for arrays of valid entry tuples', () => {
    expect(
      isEntries([
        ['name', 'Alice'],
        [1, true],
      ]),
    ).toBe(true);
    expect(
      isEntries([
        ['key', 'value'],
        ['anotherKey', 42],
      ]),
    ).toBe(true);
    expect(
      isEntries([
        ['string', 'value'],
        [123, 'number'],
        [Symbol('sym'), {}],
      ]),
    ).toBe(true);
  });

  it('returns true for empty arrays', () => {
    expect(isEntries([])).toBe(true);
  });

  it('returns false for arrays with non-tuple elements', () => {
    expect(isEntries(['not-a-tuple'])).toBe(false);
    expect(isEntries([{ key: 'value' }])).toBe(false);
    expect(isEntries([null, undefined])).toBe(false);
    expect(isEntries([1, 2, 3])).toBe(false);
  });

  it('returns false for mixed arrays with some non-tuples', () => {
    expect(isEntries([['key', 'value'], 'not-a-tuple'])).toBe(false);
    expect(isEntries([['key', 'value'], { key: 'value' }])).toBe(false);
  });

  it('returns false for non-array values', () => {
    expect(isEntries('string')).toBe(false);
    expect(isEntries(123)).toBe(false);
    expect(isEntries(true)).toBe(false);
    expect(isEntries(null)).toBe(false);
    expect(isEntries(undefined)).toBe(false);
    expect(isEntries({})).toBe(false);
    expect(isEntries(() => {})).toBe(false);
  });

  it('works as a type guard', () => {
    const value: unknown = [
      ['name', 'Alice'],
      [1, true],
    ];

    if (isEntries(value)) {
      expectTypeOf(value).toEqualTypeOf<Es<Entry>>();
      const first = value[0];
      expect(
        typeof first[0] === 'string' ||
          typeof first[0] === 'number' ||
          typeof first[0] === 'symbol',
      ).toBe(true);
      expect(first[1]).not.toBeUndefined();
      expect(value[0][0]).toBe('name');
      expect(value[0][1]).toBe('Alice');
      expect(value[1][0]).toBe(1);
      expect(value[1][1]).toBe(true);
    } else {
      expect.fail('isEntries should return true for valid entry tuples');
    }
  });

  it('handles nested entries correctly', () => {
    expect(isEntries([['config', [['debug', true]]]])).toBe(true);
    expect(
      isEntries([
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
