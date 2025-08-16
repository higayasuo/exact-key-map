import { UnionToIntersection } from './UnionToIntersection';

/**
 * Extracts the last type from a union type.
 *
 * This utility type uses TypeScript's conditional types and inference to extract
 * the last type in a union. It works by leveraging the distributive property
 * of conditional types and function parameter inference, similar to UnionToIntersection.
 *
 * @template U - The union type to extract the last type from
 *
 * @example
 * ```typescript
 * type Union = 'a' | 'b' | 'c';
 * type Last = LastInUnion<Union>;
 * // Result: 'c'
 *
 * type NumberUnion = 1 | 2 | 3;
 * type LastNumber = LastInUnion<NumberUnion>;
 * // Result: 3
 *
 * type ObjectUnion = { a: string } | { b: number } | { c: boolean };
 * type LastObject = LastInUnion<ObjectUnion>;
 * // Result: { c: boolean }
 *
 * type MixedUnion = string | number | boolean;
 * type LastMixed = LastInUnion<MixedUnion>;
 * // Result may vary across TypeScript versions for primitives.
 * // Note: For unions that include built-in primitives (e.g. string | number | boolean
 * // or true | false), TypeScript does not guarantee a stable internal ordering
 * // of union members. As a result, the inferred "last" member for such unions
 * // can differ between TypeScript versions. Prefer using literal/object unions
 * // if you need stable behavior, or pin the TypeScript version in your project.
 *
 * // IMPORTANT LIMITATION: Standalone types and arrays of types
 * // - Out of scope: unions of standalone types (e.g. primitives, classes, tuples)
 * //   and unions of array types (e.g. string[] | number[], Date[] | Uint8Array[]).
 * // - Supported: unions of object-literal types (e.g. {a: string} | {b: number})
 * //   and function unions (e.g. (() => void) | ((x: string) => number)).
 * // TypeScript does not provide stable ordering guarantees for many standalone
 * // types across versions, so behavior may vary; prefer object-literal unions
 * // when using LastInUnion.
 * ```
 *
 * @since 0.1.0
 */
export type LastInUnion<U> =
  UnionToIntersection<U extends unknown ? (x: U) => void : never> extends (
    x: infer L,
  ) => void
    ? L
    : never;
