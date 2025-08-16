import { describe, it, expectTypeOf } from 'vitest';
import type { UnionToIntersection } from '../UnionToIntersection';

describe('UnionToIntersection', () => {
  describe('object unions', () => {
    it('converts union of object types to intersection', () => {
      type Union = { a: string } | { b: number };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ a: string } & { b: number }>();
    });

    it('converts union of three object types to intersection', () => {
      type Union = { x: 1 } | { y: 2 } | { z: 3 };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ x: 1 } & { y: 2 } & { z: 3 }>();
    });

    it('handles union with overlapping properties', () => {
      type Union = { a: string; b: number } | { a: string; c: boolean };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<
        { a: string; b: number } & { a: string; c: boolean }
      >();
    });

    it('handles union with function types', () => {
      type Union = { fn: () => void } | { data: string };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<
        { fn: () => void } & { data: string }
      >();
    });

    it('handles union with array types', () => {
      type Union = { items: string[] } | { count: number };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<
        { items: string[] } & { count: number }
      >();
    });
  });

  describe('primitive unions', () => {
    it('converts primitive union to never', () => {
      type Union = string | number;
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<never>();
    });

    it('converts boolean union to never', () => {
      type Union = true | false;
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<never>();
    });

    it('converts mixed primitive union to never', () => {
      type Union = string | number | boolean;
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<never>();
    });
  });

  describe('mixed unions', () => {
    it('handles union of objects and primitives', () => {
      type Union = { a: string } | string;
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ a: string } & string>();
    });

    it('handles union of objects and arrays', () => {
      type Union = { a: string } | string[];
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ a: string } & string[]>();
    });
  });

  describe('edge cases', () => {
    it('handles single type (no union)', () => {
      type Single = { a: string };
      type Actual = UnionToIntersection<Single>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ a: string }>();
    });

    it('handles never type', () => {
      type Actual = UnionToIntersection<never>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<unknown>();
    });

    it('handles any type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type Actual = UnionToIntersection<any>;
      const value = null as unknown as Actual;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expectTypeOf(value).toEqualTypeOf<any>();
    });

    it('handles unknown type', () => {
      type Actual = UnionToIntersection<unknown>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<unknown>();
    });
  });

  describe('complex scenarios', () => {
    it('handles nested object unions', () => {
      type Union = { nested: { a: string } } | { nested: { b: number } };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<
        { nested: { a: string } } & { nested: { b: number } }
      >();
    });

    it('handles union with optional properties', () => {
      type Union = { a?: string } | { b?: number };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<{ a?: string } & { b?: number }>();
    });

    it('handles union with readonly properties', () => {
      type Union = { readonly a: string } | { readonly b: number };
      type Actual = UnionToIntersection<Union>;
      const value = null as unknown as Actual;
      expectTypeOf(value).toEqualTypeOf<
        { readonly a: string } & { readonly b: number }
      >();
    });
  });
});
