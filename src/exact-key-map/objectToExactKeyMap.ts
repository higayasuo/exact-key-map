import type { ObjectToExactKeyMap } from '../types/ObjectToExactKeyMap';
import { isPlainObject } from '../utils/isPlainObject';
import { ExactKeyMap } from './ExactKeyMap';

/**
 * Converts a plain object into an `ExactKeyMap` representation.
 *
 * This function takes an object and transforms it into an `ExactKeyMap`,
 * where each key-value pair is converted to an entry in the map. If a value
 * is a plain object, it is recursively converted into an `ExactKeyMap`.
 *
 * @typeParam T - The type of the object to convert.
 * @param obj - The object to convert into an `ExactKeyMap`.
 * @returns An `ExactKeyMap` representation of the object.
 */
export const objectToExactKeyMap = <T extends Record<string, unknown>>(
  obj: T,
): ExactKeyMap<ObjectToExactKeyMap<T>> => {
  const entries = Object.entries(obj).map(([key, value]) => {
    if (isPlainObject(value)) {
      return [key, objectToExactKeyMap(value)] as [string, unknown];
    }

    return [key, value] as [string, unknown];
  });

  return ExactKeyMap.fromEntries(entries) as unknown as ExactKeyMap<
    ObjectToExactKeyMap<T>
  >;
};
