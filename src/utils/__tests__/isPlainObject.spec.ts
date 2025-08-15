import { describe, it, expect, expectTypeOf } from 'vitest';
import { isObjectLike, isPlainObject } from '../isPlainObject';

describe('isObjectLike', () => {
  it('returns true for plain objects', () => {
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike({ a: 1, b: 2 })).toBe(true);
    expect(isObjectLike(Object.create(null))).toBe(true);
  });

  it('returns false for null', () => {
    expect(isObjectLike(null)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isObjectLike([])).toBe(false);
    expect(isObjectLike([1, 2, 3])).toBe(false);
  });

  it('returns false for other object types', () => {
    expect(isObjectLike(new Date())).toBe(false);
    expect(isObjectLike(new RegExp(''))).toBe(false);
    expect(isObjectLike(new Error())).toBe(false);
    expect(isObjectLike(() => {})).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isObjectLike('string')).toBe(false);
    expect(isObjectLike(123)).toBe(false);
    expect(isObjectLike(true)).toBe(false);
    expect(isObjectLike(undefined)).toBe(false);
    expect(isObjectLike(Symbol('sym'))).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('returns true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('returns false for objects with custom prototypes', () => {
    class CustomClass {}
    expect(isPlainObject(new CustomClass())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new RegExp(''))).toBe(false);
    expect(isPlainObject(new Error())).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it('returns false for functions', () => {
    expect(isPlainObject(() => {})).toBe(false);
    expect(isPlainObject(function () {})).toBe(false);
    expect(isPlainObject(async () => {})).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(Symbol('sym'))).toBe(false);
  });

  it('works as a type guard with generic type', () => {
    const value: unknown = { name: 'test', value: 42 };

    if (isPlainObject<{ name: string; value: number }>(value)) {
      // TypeScript should know value is the specified type here
      expectTypeOf(value).toEqualTypeOf<{ name: string; value: number }>();
      expect(value.name).toBe('test');
      expect(value.value).toBe(42);
    } else {
      expect.fail('isPlainObject should return true for plain objects');
    }
  });

  it('works as a type guard with default object type', () => {
    const value: unknown = { a: 1, b: 2 };

    if (isPlainObject(value)) {
      // TypeScript should know value is object here
      expectTypeOf(value).toEqualTypeOf<object>();
      expect(value.a).toBe(1);
      expect(value.b).toBe(2);
    } else {
      expect.fail('isPlainObject should return true for plain objects');
    }
  });

  it('handles objects with null prototype', () => {
    const obj = Object.create(null);
    obj.a = 1;
    obj.b = 2;

    expect(isPlainObject(obj)).toBe(true);
  });

  it('handles objects with Object.prototype', () => {
    const obj = Object.create(Object.prototype);
    obj.a = 1;
    obj.b = 2;

    expect(isPlainObject(obj)).toBe(true);
  });
});
