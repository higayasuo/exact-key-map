import { describe, it, expectTypeOf } from 'vitest';
import type { Widen } from '../Widen';

declare const UNIQUE: unique symbol;

describe('Widen', () => {
  it('widens string literal to string', () => {
    type Actual = Widen<'abc'>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<string>();
  });

  it('widens number literal to number', () => {
    type Actual = Widen<123>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<number>();
  });

  it('widens boolean literal to boolean', () => {
    type Actual = Widen<true>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<boolean>();
  });

  it('widens bigint literal to bigint', () => {
    type Actual = Widen<10n>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<bigint>();
  });

  it('widens unique symbol to symbol', () => {
    type Actual = Widen<typeof UNIQUE>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<symbol>();
  });

  it('widens template literal types to string', () => {
    type TL = `id_${string}`;
    type Actual = Widen<TL>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<string>();
  });

  it('does not change non-primitive object types', () => {
    type Input = { a: 1 };
    type Actual = Widen<Input>;
    const value = null as unknown as Actual;
    expectTypeOf(value).toEqualTypeOf<Input>();
  });
});
