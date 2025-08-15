import { describe, it, expectTypeOf } from 'vitest';
import type { AllValues } from '../AllValues';
import type { ExactKeyMap } from '../../ExactKeyMap';

describe('AllValues', () => {
  it('creates union of widened primitive values', () => {
    type Entries = readonly [['id', 1], ['name', 'foo'], ['active', true]];
    type Values = AllValues<Entries>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<number | string | boolean>();
  });

  it('handles nested ExactKeyMap values', () => {
    type Nested = readonly [['child', readonly [['x', 1], ['y', 2]]]];
    type Values = AllValues<Nested>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<
      ExactKeyMap<readonly [['x', number], ['y', number]]>
    >();
  });

  it('handles mixed primitive and nested values', () => {
    type Mixed = readonly [['id', 1], ['config', readonly [['debug', true]]]];
    type Values = AllValues<Mixed>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<
      number | ExactKeyMap<readonly [['debug', boolean]]>
    >();
  });

  it('preserves non-primitive object types without widening', () => {
    type WithObjects = readonly [
      ['buffer', Uint8Array],
      ['config', { debug: boolean }],
      ['callback', () => void],
    ];
    type Values = AllValues<WithObjects>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<
      Uint8Array | { debug: boolean } | (() => void)
    >();
  });

  it('resolves to never for empty entries', () => {
    type Empty = readonly [];
    type Values = AllValues<Empty>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<never>();
  });

  it('handles single entry correctly', () => {
    type Single = readonly [['key', 'value']];
    type Values = AllValues<Single>;

    const values = null as unknown as Values;
    expectTypeOf(values).toEqualTypeOf<string>();
  });
});
