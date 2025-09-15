import { describe, it, expectTypeOf } from 'vitest';
import type { AllValues } from '../AllValues';
import type { ExactKeyMap } from '@/exact-key-map/ExactKeyMap';

describe('AllValues', () => {
  it('creates union of literal primitive values', () => {
    type Entries = [['id', 1] | ['name', 'foo'] | ['active', true]];
    type Values = AllValues<Entries>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<1 | 'foo' | true>();
  });

  it('handles nested ExactKeyMap values (literals preserved)', () => {
    type Nested = [['child', [['x', 1], ['y', 2]]]];
    type Values = AllValues<Nested>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<ExactKeyMap<[['x', 1], ['y', 2]]>>();
  });

  it('handles mixed literal and nested literal values', () => {
    type Mixed = [['id', 1] | ['config', [['debug', true]]]];
    type Values = AllValues<Mixed>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<1 | ExactKeyMap<[['debug', true]]>>();
  });

  it('preserves non-primitive object types without widening', () => {
    type WithObjects = [
      | ['buffer', Uint8Array]
      | ['config', { debug: boolean }]
      | ['callback', () => void],
    ];
    type Values = AllValues<WithObjects>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<
      Uint8Array | { debug: boolean } | (() => void)
    >();
  });

  it('resolves to never for empty entries', () => {
    type Empty = [];
    type Values = AllValues<Empty>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<never>();
  });

  it('handles single entry correctly (literal preserved)', () => {
    type Single = [['key', 'value']];
    type Values = AllValues<Single>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<'value'>();
  });
});
