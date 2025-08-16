type WidenPrimitive<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T extends `${string}`
            ? string
            : T;

type WidenArray<T> = T extends readonly (infer U)[] ? Widen<U>[] : T;

type NormalizeTypedArrays<T> =
  T extends Uint8Array<ArrayBufferLike> ? Uint8Array : T;

/**
 * Widens literal primitive types to their base types.
 *
 * This utility type automatically converts literal primitive types to their base primitive types.
 * It also handles arrays, tuples, and typed arrays with appropriate widening behavior.
 *
 * @template T - The type to widen
 *
 * @example
 * ```typescript
 * // Primitive widening
 * type StringType = Widen<'hello'>; // string
 * type NumberType = Widen<42>; // number
 * type BooleanType = Widen<true>; // boolean
 * type BigIntType = Widen<10n>; // bigint
 * type SymbolType = Widen<typeof uniqueSymbol>; // symbol
 *
 * // Template literal types
 * type TemplateType = Widen<`id_${string}`>; // string
 *
 * // Arrays and tuples
 * type ArrayType = Widen<[1, 2]>; // number[]
 * type MixedArray = Widen<[1, 'a', true]>; // (number | string | boolean)[]
 * type ReadonlyArray = Widen<readonly ['x', 1]>; // (string | number)[]
 *
 * // Typed arrays
 * type TypedArray = Widen<Uint8Array<ArrayBufferLike>>; // Uint8Array
 *
 * // Non-primitive objects are preserved
 * type ObjectType = Widen<{ a: 1 }>; // { a: 1 }
 * type DateType = Widen<Date>; // Date
 * ```
 *
 * @since 0.1.0
 */
export type Widen<T> = NormalizeTypedArrays<WidenPrimitive<WidenArray<T>>>;
