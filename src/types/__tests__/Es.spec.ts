import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Es } from '../Es';

describe('Es type alias', () => {
  it('accepts array of union-of-tuples', () => {
    type Entries = Es<['name', string] | [1, boolean]>;
    const entries: Entries = [
      ['name', 'Alice'],
      [1, true],
    ];

    expect(entries.length).toBe(2);
    expectTypeOf<Entries>().toEqualTypeOf<
      ReadonlyArray<['name', string] | [1, boolean]>
    >();
  });

  it('supports nested entries via Es alias', () => {
    type EEs = Es<['e', number]>;
    type DEs = Es<['d', EEs]>;
    type Entries = Es<['a', number] | ['c', DEs]>;

    const nested: Entries = [
      ['a', 1],
      ['c', [['d', [['e', 3]]]]],
    ];

    expect(nested[0][0]).toBe('a');
    expect(nested[1][0]).toBe('c');
    expectTypeOf<Entries>().toEqualTypeOf<
      ReadonlyArray<
        | ['a', number]
        | ['c', ReadonlyArray<['d', ReadonlyArray<['e', number]>]>]
      >
    >();
  });

  it('accepts subset of union-of-tuples (single variant only)', () => {
    type Entries = Es<['name', string] | [1, boolean] | ['ccc', Date]>;
    const subset: Entries = [['name', 'Alice']];

    expect(subset.length).toBe(1);
    expect(subset[0][0]).toBe('name');
    expect(subset[0][1]).toBe('Alice');
    expectTypeOf(subset).toEqualTypeOf<Entries>();
  });

  it('supports subset in nested entries (only nested branch provided)', () => {
    type EEs = Es<['e', number]>;
    type DEs = Es<['d', EEs]>;
    type Entries = Es<['a', number] | ['c', DEs]>;

    const subsetNested: Entries = [['c', [['d', [['e', 3]]]]]];

    // The intent is to allow providing only the 'c' branch as a subset
    // Using type assertion to focus the test on subset acceptability, not literal inference nuances
    expect(Array.isArray(subsetNested)).toBe(true);
    expectTypeOf(subsetNested).toEqualTypeOf<Entries>();
  });

  it('rejects invalid tuple shapes and value types (type-level)', () => {
    type Entries = Es<['name', string] | [1, boolean]>;

    // @ts-expect-error wrong value type for 'name'
    const invalidValue: Entries = [['name', 123]];

    expect(invalidValue).toBeDefined();
  });
});
