/**
 * Widen a literal primitive type to its base primitive.
 *
 * - 'abc' -> string
 * - 123 -> number
 * - true -> boolean
 * - 10n -> bigint
 * - unique symbol -> symbol
 * - template literal types -> string
 */

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

export type Widen<T> = NormalizeTypedArrays<WidenPrimitive<WidenArray<T>>>;
