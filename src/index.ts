/**
 * Create a map object that enforces exact keys from the provided record type.
 * This helps prevent typos and missing keys at compile time.
 */
export type ExactKeyMap<TRecord extends Record<string, unknown>> = {
  readonly [TKey in keyof TRecord]: TRecord[TKey];
};

/**
 * Create an `ExactKeyMap` from a given object.
 * The identity function exists purely to preserve the exact key set in TS.
 */
export const createExactKeyMap = <TRecord extends Record<string, unknown>>(
  record: ExactKeyMap<TRecord>
): ExactKeyMap<TRecord> => record;

export const version = '0.1.0';

