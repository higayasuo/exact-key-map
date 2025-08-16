import { describe, it, expectTypeOf } from 'vitest';
import type { LastInUnion } from '../LastInUnion';

describe('LastInUnion', () => {
  describe('object unions', () => {
    it('extracts last object type from union', () => {
      type Union = { a: string } | { b: number } | { c: boolean };
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ c: boolean }>();
    });

    it('extracts last object with complex properties', () => {
      type Union =
        | { id: number; name: string }
        | { id: string; active: boolean }
        | { id: symbol; data: unknown };
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ id: symbol; data: unknown }>();
    });

    it('handles single object type', () => {
      type Union = { x: number; y: string };
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ x: number; y: string }>();
    });
  });

  describe('array and function unions', () => {
    it('extracts last function type from union', () => {
      type Union =
        | (() => void)
        | ((x: string) => number)
        | ((x: number) => boolean);
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<(x: number) => boolean>();
    });

    it('extracts last function type from different ordering (A)', () => {
      type Union =
        | ((x: string) => number)
        | ((x: number) => boolean)
        | (() => void);
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<() => void>();
    });

    it('extracts last function type from different ordering (B)', () => {
      type Union =
        | ((x: number) => boolean)
        | (() => void)
        | ((x: string) => number);
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<(x: string) => number>();
    });
  });

  // Unions that include class types or arrays of class types are out of scope
  // for LastInUnion due to non-deterministic ordering across TS versions.
  describe('edge cases', () => {
    it('handles never type', () => {
      type Actual = LastInUnion<never>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<never>();
    });

    it('handles any type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type Actual = LastInUnion<any>;
      const value = null as unknown as Actual;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expectTypeOf(value).toEqualTypeOf<any>();
    });

    it('handles unknown type', () => {
      type Actual = LastInUnion<unknown>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<unknown>();
    });

    it('handles union with never', () => {
      type Union = { a: string } | never | { b: number };
      type Actual = LastInUnion<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ b: number }>();
    });
  });
});
