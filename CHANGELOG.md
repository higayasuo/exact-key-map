# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-09-15

### Changed

- Switched API to prefer constructor with union-of-tuples generics; `withTypes` removed
- Introduced `ExactKeyMap.fromEntries([... ] as const)` for literal preservation use-cases
- Updated JSDoc and README to union-style examples; removed references to other map variants

### Removed

- `withTypes` API and related README examples
- Documentation for non-existent variants
- `LooseExactKeyMap` class
- `ConstExactKeyMap` class

### Migration Notes (breaking)

- Replace `ExactKeyMap.withTypes<...>()` with `new ExactKeyMap<...>(entries)`
- For preserved literal values during construction, use `ExactKeyMap.fromEntries(entries as const)`
- Update code using array-of-entries generics to union-of-tuples generics

## [0.1.4] - 2025-09-15

### Added

- `ExactKeyMap.withTypes` now accepts:
  - no arguments (empty typed map)
  - a single entries array
  - variadic entry pairs
  - explicit generics with subset argument data (populate remaining keys later)
- New tests grouping: split into `fromEntries` and `withTypes` with purpose-based sub-groups
- Tests for `withTypes` entries array, variadic pairs, and generics+subset data

### Changed

- Refined `withTypes` overloads to decouple explicit generics from provided argument data
- Reorganized `ExactKeyMap.spec.ts` describes for clarity
- Updated README with expanded `withTypes` examples and API signatures

## [0.1.3] - 2025-09-12

### Added

- Tests for COSE protected headers pattern (enum-based keys with Exclude catch-all)
- Tests for NormalizeValue (primitives, flat entries, nested entries)
- Tests for ExtractExactEntry utility

### Changed

- ValueOfKey: support catch-all enum keys when no exact entry exists
- ExactKeyMap.spec.ts: inlined Headers enum and factory to remove external test deps

### Fixed

- NormalizeValue: avoid premature Widen inside recursion to preserve nested entry shapes

## [0.1.2] - 2025-09-12

### Added

- `ExactKeyMap.withTypes<Entries>()` static method - Creates empty maps with predefined types for later population
- `LooseExactKeyMap` class - Flexible variant that allows additional keys beyond predefined ones while maintaining type safety for known keys
- `ConstExactKeyMap` class - Read-only variant that preserves literal types and prevents modifications after construction
- `TransformNestedConstEntries<E>` type utility - Transforms nested entry arrays while preserving literal value types (unlike `TransformNestedEntries` which widens them)
- Additional utility functions:
  - `isEntriesArray` - Checks if value is an array of entry tuples
  - `toEntriesArray` - Converts variadic entries to a single array format

### Enhanced

- Updated README.md with comprehensive documentation for all new map variants and type utilities
- Added comparison table showing differences between all map variants
- Enhanced API reference with detailed examples for each new class and method

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
