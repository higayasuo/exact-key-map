/**
 * Converts a union type to an intersection type.
 *
 * This utility type uses TypeScript's conditional types and inference to transform
 * a union of types into an intersection of those same types. It works by leveraging
 * the distributive property of conditional types and function parameter inference.
 *
 * @template U - The union type to convert to an intersection
 *
 * @example
 * ```typescript
 * type Union = { a: string } | { b: number };
 * type Intersection = UnionToIntersection<Union>;
 * // Result: { a: string } & { b: number }
 *
 * type StringOrNumber = string | number;
 * type Never = UnionToIntersection<StringOrNumber>;
 * // Result: never (primitives don't form meaningful intersections)
 *
 * type ObjectUnion = { x: 1 } | { y: 2 } | { z: 3 };
 * type ObjectIntersection = UnionToIntersection<ObjectUnion>;
 * // Result: { x: 1 } & { y: 2 } & { z: 3 }
 * ```
 *
 * @since 0.1.0
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;
