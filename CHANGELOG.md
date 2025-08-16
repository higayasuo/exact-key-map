# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-08-16

### Removed

- `ExactKeyMap.fromObject()` method - Removed due to incomplete implementation
- `objectToExactKeyMap` function - Removed as it was only used by `fromObject`
- `ObjectToExactKeyMap<T>` type utility - Removed as it was only used by `fromObject`
- `UnionToIntersection<U>` type utility - Removed as it was only used by `LastInUnion`
- `LastInUnion<U>` type utility - Removed due to incomplete implementation

### Changed

- Updated JSDoc examples to use `ExactKeyMap.fromEntries()` instead of constructor
- Constructor is now properly documented as protected, directing users to use `fromEntries`

## [0.1.0] - 2025-08-16

### Added

- Initial release of `exact-key-map`
- `ExactKeyMap` class with exact key typing and automatic nested map conversion
- Static factory method `fromEntries` for creating instances
- Type-safe `get`, `set`, and `delete` methods
- Comprehensive type utilities:
  - `KeysOfEntries<Entries>` - Extracts union of key types
  - `ValueOfKey<Entries, K>` - Resolves value type for specific key
  - `AllValues<Entries>` - Creates union of all value types
  - `Widen<T>` - Widens literal types to base types
  - `ExtractExactKeyMapGenerics<T>` - Extracts generic entries parameter
  - `TransformNestedEntries<E>` - Transforms nested entry arrays
- Utility functions:
  - `isArrayOfTuples` - Checks if value is array of tuples
  - `isPlainObject` - Checks if value is plain object with type guard
  - `isTuple` - Checks if value is tuple with exactly 2 elements
- Full TypeScript support with excellent type inference
- Comprehensive test suite with 82 tests
- Zero dependencies
- MIT license
