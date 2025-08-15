import { describe, it, expectTypeOf } from 'vitest';
import type { KeysOfEntries } from '../KeysOfEntries';

describe('KeysOfEntries', () => {
  it('infers union of keys from a literal entries tuple', () => {
    type Entries = readonly [['id', number], ['name', string]];
    type Keys = KeysOfEntries<Entries>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<'id' | 'name'>();
  });

  it('infers keys from Object.entries result', () => {
    const obj = { a: 1, b: 2 } as const;
    const entries = Object.entries(obj) as ReadonlyArray<
      readonly ['a' | 'b', 1 | 2]
    >;
    type Keys = KeysOfEntries<typeof entries>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<'a' | 'b'>();
  });

  it('resolves to never for an empty entries list', () => {
    type Empty = readonly [];
    type Keys = KeysOfEntries<Empty>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<never>(undefined as never);
  });

  it('widens to string when keys are typed as string', () => {
    const entries: ReadonlyArray<readonly [string, number]> = [
      ['x', 1],
      ['y', 2],
    ];
    type Keys = KeysOfEntries<typeof entries>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
