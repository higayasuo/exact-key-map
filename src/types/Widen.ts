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
export type Widen<T> = T extends string
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
