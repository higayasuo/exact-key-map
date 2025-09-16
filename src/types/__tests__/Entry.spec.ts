import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Entry } from '../Entry';

describe('Tuple type alias', () => {
  it('accepts 2-length tuples of any key/value types', () => {
    const a: Entry = ['key', 'value'];
    const b: Entry = [1, true];
    const c: Entry = ['name', { id: 123 }];

    expect(a.length).toBe(2);
    expect(b.length).toBe(2);
    expect(c.length).toBe(2);

    expect(a[0]).toBe('key');
    expect(b[1]).toBe(true);
    expectTypeOf<Entry>().toEqualTypeOf<readonly [unknown, unknown]>();
  });

  it('rejects non-2-length tuples (type-level)', () => {
    // @ts-expect-error too few elements
    const x0: Entry = [];
    // @ts-expect-error too few elements
    const x1: Entry = [1];
    // @ts-expect-error too many elements
    const x3: Entry = [1, 2, 3];

    expect([x0, x1, x3].length).toBe(3);
  });

  it('is readonly at type-level (no mutation methods, no index assignment)', () => {
    const t: Entry = ['a', 1];

    // @ts-expect-error cannot assign to readonly property
    t[0] = 'b';

    // @ts-expect-error push does not exist on readonly tuple
    t.push('x');
  });
});
