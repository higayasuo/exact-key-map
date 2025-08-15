import { describe, it, expectTypeOf } from 'vitest';
import type { KeysOfEntries } from '../KeysOfEntries';

describe('KeysOfEntries', () => {
  it('infers union of keys from a literal entries tuple', () => {
    type Entries = [['id', number], ['name', string]];
    type Keys = KeysOfEntries<Entries>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<'id' | 'name'>();
  });

  it('resolves to never for an empty entries list', () => {
    type Empty = [];
    type Keys = KeysOfEntries<Empty>;
    const value = null as unknown as Keys;
    expectTypeOf(value).toEqualTypeOf<never>(undefined as never);
  });
});
