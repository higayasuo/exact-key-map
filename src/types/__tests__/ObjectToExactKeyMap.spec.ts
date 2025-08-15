import { describe, it, expectTypeOf } from 'vitest';
import type { ObjectToExactKeyMap } from '../ObjectToExactKeyMap';
import type { ValueOfKey } from '../ValueOfKey';
import type { ExtractExactKeyMapGenerics } from '../ExtractExactKeyMapGenerics';

describe('ObjectToExactKeyMap', () => {
  it('converts simple object with primitive values', () => {
    type User = {
      name: string;
      age: number;
      isActive: boolean;
    };

    type Entries = ObjectToExactKeyMap<User>;

    const nameVal = null as unknown as ValueOfKey<Entries, 'name'>;
    const ageVal = null as unknown as ValueOfKey<Entries, 'age'>;
    const isActiveVal = null as unknown as ValueOfKey<Entries, 'isActive'>;
    expectTypeOf(nameVal).toEqualTypeOf<string>();
    expectTypeOf(ageVal).toEqualTypeOf<number>();
    expectTypeOf(isActiveVal).toEqualTypeOf<boolean>();
  });

  it('converts object with mixed primitive types', () => {
    type Config = {
      id: 1;
      title: 'test';
      enabled: true;
      count: 42;
    };

    type Entries = ObjectToExactKeyMap<Config>;

    const idVal = null as unknown as ValueOfKey<Entries, 'id'>;
    const titleVal = null as unknown as ValueOfKey<Entries, 'title'>;
    const enabledVal = null as unknown as ValueOfKey<Entries, 'enabled'>;
    const countVal = null as unknown as ValueOfKey<Entries, 'count'>;
    expectTypeOf(idVal).toEqualTypeOf<number>();
    expectTypeOf(titleVal).toEqualTypeOf<string>();
    expectTypeOf(enabledVal).toEqualTypeOf<boolean>();
    expectTypeOf(countVal).toEqualTypeOf<number>();
  });

  it('converts object with function and object values', () => {
    type Handler = {
      callback: () => void;
      data: { id: number; name: string };
      buffer: Uint8Array;
    };

    type Entries = ObjectToExactKeyMap<Handler>;

    const callbackVal = null as unknown as ValueOfKey<Entries, 'callback'>;
    const bufferVal = null as unknown as ValueOfKey<Entries, 'buffer'>;
    expectTypeOf(callbackVal).toEqualTypeOf<() => void>();
    expectTypeOf(bufferVal).toEqualTypeOf<Uint8Array>();

    type DataEntries = ExtractExactKeyMapGenerics<ValueOfKey<Entries, 'data'>>;
    const dataName = null as unknown as ValueOfKey<DataEntries, 'name'>;
    const dataId = null as unknown as ValueOfKey<DataEntries, 'id'>;
    expectTypeOf(dataName).toEqualTypeOf<string>();
    expectTypeOf(dataId).toEqualTypeOf<number>();
  });

  it('converts object with nested objects', () => {
    type NestedConfig = {
      database: {
        host: string;
        port: number;
      };
      cache: {
        enabled: boolean;
        ttl: number;
      };
    };

    type Entries = ObjectToExactKeyMap<NestedConfig>;

    type DatabaseEntries = ExtractExactKeyMapGenerics<
      ValueOfKey<Entries, 'database'>
    >;
    const hostVal = null as unknown as ValueOfKey<DatabaseEntries, 'host'>;
    const portVal = null as unknown as ValueOfKey<DatabaseEntries, 'port'>;
    expectTypeOf(hostVal).toEqualTypeOf<string>();
    expectTypeOf(portVal).toEqualTypeOf<number>();

    type CacheEntries = ExtractExactKeyMapGenerics<
      ValueOfKey<Entries, 'cache'>
    >;
    const enabledVal = null as unknown as ValueOfKey<CacheEntries, 'enabled'>;
    const ttlVal = null as unknown as ValueOfKey<CacheEntries, 'ttl'>;
    expectTypeOf(enabledVal).toEqualTypeOf<boolean>();
    expectTypeOf(ttlVal).toEqualTypeOf<number>();
  });

  it('converts object with optional properties', () => {
    type OptionalUser = {
      name: string;
      age?: number;
      email?: string;
    };

    type Entries = ObjectToExactKeyMap<OptionalUser>;

    const nameVal = null as unknown as ValueOfKey<Entries, 'name'>;
    const ageVal = null as unknown as ValueOfKey<Entries, 'age'>;
    const emailVal = null as unknown as ValueOfKey<Entries, 'email'>;
    expectTypeOf(nameVal).toEqualTypeOf<string>();
    expectTypeOf(ageVal).toEqualTypeOf<number | undefined>();
    expectTypeOf(emailVal).toEqualTypeOf<string | undefined>();
  });

  it('converts object with readonly properties', () => {
    type ReadonlyConfig = {
      readonly apiKey: string;
      readonly version: '1.0.0';
      readonly debug: boolean;
    };

    type Entries = ObjectToExactKeyMap<ReadonlyConfig>;

    const apiKey = null as unknown as ValueOfKey<Entries, 'apiKey'>;
    const version = null as unknown as ValueOfKey<Entries, 'version'>;
    const debug = null as unknown as ValueOfKey<Entries, 'debug'>;
    expectTypeOf(apiKey).toEqualTypeOf<string>();
    expectTypeOf(version).toEqualTypeOf<string>();
    expectTypeOf(debug).toEqualTypeOf<boolean>();
  });

  it('converts object with union types', () => {
    type UnionConfig = {
      status: 'loading' | 'success' | 'error';
      data: string | number | null;
      flags: boolean | number;
    };

    type Entries = ObjectToExactKeyMap<UnionConfig>;

    const status = null as unknown as ValueOfKey<Entries, 'status'>;
    const data = null as unknown as ValueOfKey<Entries, 'data'>;
    const flags = null as unknown as ValueOfKey<Entries, 'flags'>;
    expectTypeOf(status).toEqualTypeOf<string>();
    expectTypeOf(data).toEqualTypeOf<string | number | null>();
    expectTypeOf(flags).toEqualTypeOf<boolean | number>();
  });

  it('converts object with array values', () => {
    type ArrayConfig = {
      tags: string[];
      scores: number[];
      flags: boolean[];
    };

    type Entries = ObjectToExactKeyMap<ArrayConfig>;

    const tags = null as unknown as ValueOfKey<Entries, 'tags'>;
    const scores = null as unknown as ValueOfKey<Entries, 'scores'>;
    const flags = null as unknown as ValueOfKey<Entries, 'flags'>;
    expectTypeOf(tags).toEqualTypeOf<string[]>();
    expectTypeOf(scores).toEqualTypeOf<number[]>();
    expectTypeOf(flags).toEqualTypeOf<boolean[]>();
  });

  it('converts object with tuple values', () => {
    type TupleConfig = {
      coordinates: [number, number];
      rgb: [number, number, number];
      pair: [string, boolean];
    };

    type Entries = ObjectToExactKeyMap<TupleConfig>;

    const c = null as unknown as ValueOfKey<Entries, 'coordinates'>;
    const r = null as unknown as ValueOfKey<Entries, 'rgb'>;
    const p = null as unknown as ValueOfKey<Entries, 'pair'>;
    expectTypeOf(c).toEqualTypeOf<number[]>();
    expectTypeOf(r).toEqualTypeOf<number[]>();
    expectTypeOf(p).toEqualTypeOf<(string | boolean)[]>();
  });

  it('converts object with generic types', () => {
    type GenericConfig<T> = {
      value: T;
      list: T[];
      optional: T | undefined;
    };

    type Entries = ObjectToExactKeyMap<GenericConfig<string>>;

    const value = null as unknown as ValueOfKey<Entries, 'value'>;
    const list = null as unknown as ValueOfKey<Entries, 'list'>;
    const optional = null as unknown as ValueOfKey<Entries, 'optional'>;
    expectTypeOf(value).toEqualTypeOf<string>();
    expectTypeOf(list).toEqualTypeOf<string[]>();
    expectTypeOf(optional).toEqualTypeOf<string | undefined>();
  });

  it('converts object with symbol keys', () => {
    type SymbolConfig = {
      [Symbol.iterator]: () => Iterator<string>;
      [Symbol.toStringTag]: string;
    };

    type Entries = ObjectToExactKeyMap<SymbolConfig>;

    const iteratorVal = null as unknown as ValueOfKey<
      Entries,
      typeof Symbol.iterator
    >;
    const tagVal = null as unknown as ValueOfKey<
      Entries,
      typeof Symbol.toStringTag
    >;
    expectTypeOf(iteratorVal).toEqualTypeOf<() => Iterator<string>>();
    expectTypeOf(tagVal).toEqualTypeOf<string>();
  });

  // it('converts object with index signatures', () => {
  //   type IndexConfig = {
  //     [key: string]: number;
  //     id: 1;
  //     count: 42;
  //   };

  //   type Entries = ObjectToExactKeyMap<IndexConfig>;

  //   const idVal = null as unknown as ValueOfKey<Entries, 'id'>;
  //   const countVal = null as unknown as ValueOfKey<Entries, 'count'>;
  //   expectTypeOf(idVal).toEqualTypeOf<number>();
  //   expectTypeOf(countVal).toEqualTypeOf<number>();
  // });

  it('converts empty object', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type Empty = {};
    type EmptyMap = ObjectToExactKeyMap<Empty>;

    const emptyMap = null as unknown as EmptyMap;
    expectTypeOf(emptyMap).toEqualTypeOf<readonly []>();
  });

  it('converts object with single property', () => {
    type Single = {
      name: string;
    };

    type Entries = ObjectToExactKeyMap<Single>;

    const name = null as unknown as ValueOfKey<Entries, 'name'>;
    expectTypeOf(name).toEqualTypeOf<string>();
  });

  it('converts object with deeply nested objects', () => {
    type DeepNested = {
      level1: {
        level2: {
          level3: {
            value: string;
          };
        };
      };
    };

    type Entries = ObjectToExactKeyMap<DeepNested>;

    type Level1Entries = ExtractExactKeyMapGenerics<
      ValueOfKey<Entries, 'level1'>
    >;
    type Level2Entries = ExtractExactKeyMapGenerics<
      ValueOfKey<Level1Entries, 'level2'>
    >;
    type Level3Entries = ExtractExactKeyMapGenerics<
      ValueOfKey<Level2Entries, 'level3'>
    >;

    const value = null as unknown as ValueOfKey<Level3Entries, 'value'>;
    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
