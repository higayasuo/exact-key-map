import { describe, it, expect } from 'vitest';
import { isEntriesArray } from '../isEntriesArray';

describe('isEntriesArray', () => {
  it('valid: returns true for empty entries array', () => {
    const first = [] as const;
    expect(isEntriesArray(first)).toBe(true);
  });

  it('valid: returns true for single entry array', () => {
    const first = [['a', 1]] as const;
    expect(isEntriesArray(first)).toBe(true);
  });

  it('valid: returns true for nested entries array', () => {
    const first = [['a', [['b', 2]]]] as const;
    expect(isEntriesArray(first)).toBe(true);
  });

  it('valid: returns false for a single tuple (not an entries array)', () => {
    const first = ['a', 1] as const;
    expect(isEntriesArray(first)).toBe(false);
  });
});
