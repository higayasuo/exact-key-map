import { describe, it, expect, expectTypeOf } from 'vitest';
import { objectToExactKeyMap } from '@/exact-key-map/objectToExactKeyMap';
import { ExactKeyMap } from '@/exact-key-map/ExactKeyMap';
import type { ObjectToExactKeyMap } from '@/types/ObjectToExactKeyMap';

describe('objectToExactKeyMap', () => {
  it('converts flat object to ExactKeyMap', () => {
    const src = { name: 'Alice', age: 30 };

    const result = objectToExactKeyMap(src);
    expect(result).toBeInstanceOf(ExactKeyMap);
    expect(result.get('name')).toBe('Alice');
    expect(result.get('age')).toBe(30);
  });

  it('converts nested plain objects to nested ExactKeyMap', () => {
    const src = {
      database: {
        host: 'localhost',
        port: 5432,
      },
      cache: {
        enabled: true,
        ttl: 60,
      },
    };

    const result = objectToExactKeyMap(src);
    expect(result).toBeInstanceOf(ExactKeyMap);

    const db = result.get('database')!;
    expect(db).toBeInstanceOf(ExactKeyMap);
    const host = db.get('host');
    const port = db.get('port');
    expect(host).toBe('localhost');
    expect(port).toBe(5432);

    const cache = result.get('cache')!;
    expect(cache).toBeInstanceOf(ExactKeyMap);
    expect(cache.get('enabled')).toBe(true);
    expect(cache.get('ttl')).toBe(60);
  });

  it('does not convert arrays or functions', () => {
    const fn = (): string => 'ok';
    const src = {
      list: [1, 2, 3],
      cb: fn,
    };

    const result = objectToExactKeyMap(src);

    expect(result.get('list')).toEqual([1, 2, 3]);
    expect(result.get('cb')).toBe(fn);
  });

  it('has expected entry types (order-agnostic)', () => {
    const src = { id: 1, title: 't' };
    const r = objectToExactKeyMap(src);
    // Type-only check
    expectTypeOf(r).toEqualTypeOf<
      ExactKeyMap<ObjectToExactKeyMap<typeof src>>
    >();
  });
});
