import { describe, it, expectTypeOf } from 'vitest';
import type { Widen } from '../Widen';

declare const _UNIQUE: unique symbol;

describe('Widen', () => {
  describe('primitive widening', () => {
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
      type Actual = Widen<typeof _UNIQUE>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<symbol>();
    });

    it('widens template literal types to string', () => {
      type TL = `id_${string}`;
      type Actual = Widen<TL>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<string>();
    });
  });

  describe('non-primitive objects', () => {
    it('does not change non-primitive object types', () => {
      type Input = { a: 1 };
      type Actual = Widen<Input>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<Input>();
    });
  });

  describe('typed arrays', () => {
    it('keeps Uint8Array unchanged', () => {
      type Actual = Widen<Uint8Array>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<Uint8Array>();
    });

    it('normalizes Uint8Array<ArrayBufferLike> to Uint8Array', () => {
      type Actual = Widen<Uint8Array<ArrayBufferLike>>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<Uint8Array>();
    });
  });

  describe('arrays and tuples', () => {
    it('widens tuple to homogeneous array of widened union for numeric tuple', () => {
      type Actual = Widen<[1, 2]>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<number[]>();
    });

    it('widens tuple with mixed element types to array of union', () => {
      type Actual = Widen<[1, 'a', true]>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<(number | string | boolean)[]>();
    });

    it('widens readonly array element type recursively', () => {
      type Actual = Widen<readonly ['x', 1, 2]>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<(string | number)[]>();
    });
  });
});
