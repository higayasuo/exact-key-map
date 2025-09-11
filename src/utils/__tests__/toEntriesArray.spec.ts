import { describe, it, expect } from 'vitest';
import { toEntriesArray } from '../toEntriesArray';
import { ArrayOfTuples } from '../isArrayOfTuples';

describe('toEntriesArray', () => {
  it('valid: returns the same array when given an entries array', () => {
    const input: ArrayOfTuples = [
      ['a', 1],
      ['b', 2],
    ];
    const result = toEntriesArray(input);
    expect(result).toEqual(input);
  });

  it('valid: normalizes variadic key-value tuples to an entries array', () => {
    const result = toEntriesArray(['a', 1], ['b', 2]);
    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  it('valid: handles empty entries array', () => {
    const result = toEntriesArray([]);
    expect(result).toEqual([]);
  });

  it('valid: preserves nested entries structure', () => {
    const input: ArrayOfTuples = [['a', [['b', 2]]]];
    const result = toEntriesArray(input);
    expect(result).toEqual(input);
  });

  it('valid: wraps a single tuple into an entries array when no rest is provided', () => {
    const result = toEntriesArray(['k', 'v']);
    expect(result).toEqual([['k', 'v']]);
  });
});
