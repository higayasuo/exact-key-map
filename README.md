# exact-key-map

A strongly-typed `Map` extension for TypeScript that automatically infers literal key types and preserves value types, including nested maps. Perfect for configuration objects, data structures, and any scenario where you need exact key typing without `as const`.

## Features

- 🔒 **Exact Key Types**: Keys retain their literal types (e.g., `'name'` stays `'name'`, not `string`)
- 🔄 **Value Widening**: Literal values are automatically widened to their base types (e.g., `'Alice'` becomes `string`)
- 🏗️ **Nested Support**: Nested entry arrays are automatically converted to nested `ExactKeyMap` instances
- 📦 **Zero Dependencies**: Lightweight with no external dependencies
- 🎯 **TypeScript First**: Built with TypeScript and provides excellent type inference
- 🧪 **Fully Tested**: Comprehensive test suite with 52 tests

## Installation

```bash
npm install exact-key-map
```

## Quick Start

```typescript
import { ExactKeyMap } from 'exact-key-map';

// Create a map with exact key types
const userMap = new ExactKeyMap([
  ['name', 'Alice'],
  ['age', 30],
  ['isActive', true],
]);

// TypeScript knows the exact key types
userMap.get('name'); // string | undefined
userMap.get('age'); // number | undefined
userMap.get('isActive'); // boolean | undefined

// Set values with type safety
userMap.set('name', 'Bob'); // ✅ Valid
userMap.set('age', 25); // ✅ Valid
userMap.set('isActive', false); // ✅ Valid
// userMap.set('invalid', 'value'); // ❌ TypeScript error
```

## Nested Maps

```typescript
const config = new ExactKeyMap([
  [
    'database',
    [
      ['host', 'localhost'],
      ['port', 5432],
      [
        'credentials',
        [
          ['username', 'admin'],
          ['password', 'secret'],
        ],
      ],
    ],
  ],
  [
    'api',
    [
      ['baseUrl', 'https://api.example.com'],
      ['timeout', 5000],
    ],
  ],
]);

// Nested maps are automatically created
const db = config.get('database');
// Type: ExactKeyMap<readonly [['host', string], ['port', number], ['credentials', ExactKeyMap<...>]]> | undefined

const credentials = db?.get('credentials');
// Type: ExactKeyMap<readonly [['username', string], ['password', string]]> | undefined

const username = credentials?.get('username');
// Type: string | undefined
```

## API Reference

### `ExactKeyMap<Entries>`

A strongly-typed Map class that extends the native `Map` with exact key typing.

#### Constructor

```typescript
new ExactKeyMap(entries: Entries)
new ExactKeyMap(...entries: Entries)
```

**Parameters:**

- `entries`: A readonly array of `[Key, Value]` pairs

#### Methods

##### `get<K>(key: K): ValueOfKey<Entries, K> | undefined`

Retrieves a value by key with exact type inference.

```typescript
const map = new ExactKeyMap([
  ['name', 'Alice'],
  [1, true],
]);
const name = map.get('name'); // string | undefined
const value = map.get(1); // boolean | undefined
```

##### `set<K>(key: K, value: ValueOfKey<Entries, K>): this`

Sets a value with type safety.

```typescript
const map = new ExactKeyMap([
  ['name', 'Alice'],
  [1, true],
]);
map.set('name', 'Bob'); // ✅ Valid
map.set(1, false); // ✅ Valid
// map.set('name', 123); // ❌ TypeScript error
```

### Type Utilities

#### `KeysOfEntries<Entries>`

Extracts the union of all key types from an entries array.

```typescript
type Entries = readonly [['id', number], ['name', string]];
type Keys = KeysOfEntries<Entries>; // 'id' | 'name'
```

#### `ValueOfKey<Entries, K>`

Resolves the value type associated with a specific key.

```typescript
type Entries = readonly [['id', number], ['name', string]];
type IdValue = ValueOfKey<Entries, 'id'>; // number
type NameValue = ValueOfKey<Entries, 'name'>; // string
```

#### `AllValues<Entries>`

Creates a union of all value types from an entries array.

```typescript
type Entries = readonly [['id', number], ['name', string], ['active', boolean]];
type Values = AllValues<Entries>; // number | string | boolean
```

#### `Widen<T>`

Widens literal primitive types to their base types.

```typescript
type StringType = Widen<'hello'>; // string
type NumberType = Widen<42>; // number
type BooleanType = Widen<true>; // boolean
```

### Utility Functions

#### `isArrayOfTuples(value: unknown): value is Array<[PropertyKey, unknown]>`

Checks if a value is an array of entry tuples.

```typescript
isArrayOfTuples([
  ['name', 'Alice'],
  [1, true],
]); // true
isArrayOfTuples(['not-a-tuple']); // false
```

#### `isPlainObject<T = object>(input: unknown): input is T`

Checks if a value is a plain object with type guard support.

```typescript
isPlainObject({ a: 1, b: 2 }); // true
isPlainObject<{ a: number; b: number }>({ a: 1, b: 2 }); // true with type narrowing
```

#### `isTuple(value: unknown): value is [unknown, unknown]`

Checks if a value is a tuple with exactly 2 elements.

```typescript
isTuple([1, 2]); // true
isTuple([1, 2, 3]); // false
isTuple('string'); // false
```

## Use Cases

### Configuration Objects

```typescript
const appConfig = new ExactKeyMap([
  [
    'server',
    [
      ['host', 'localhost'],
      ['port', 3000],
      ['ssl', true],
    ],
  ],
  [
    'database',
    [
      ['url', 'postgresql://localhost:5432/mydb'],
      ['poolSize', 10],
    ],
  ],
  [
    'features',
    [
      ['debug', false],
      ['cache', true],
    ],
  ],
]);
```

### API Response Mapping

```typescript
const userResponse = new ExactKeyMap([
  ['id', 123],
  ['name', 'John Doe'],
  ['email', 'john@example.com'],
  [
    'profile',
    [
      ['avatar', 'https://example.com/avatar.jpg'],
      ['bio', 'Software Developer'],
    ],
  ],
]);
```

### Form Data

```typescript
const formData = new ExactKeyMap([
  ['firstName', 'Jane'],
  ['lastName', 'Smith'],
  ['age', 25],
  ['interests', ['coding', 'reading', 'hiking']],
  [
    'preferences',
    [
      ['theme', 'dark'],
      ['notifications', true],
    ],
  ],
]);
```

## Comparison with Native Map

| Feature        | Native Map                   | ExactKeyMap           |
| -------------- | ---------------------------- | --------------------- |
| Key Types      | `string \| number \| symbol` | Exact literal types   |
| Value Types    | `any`                        | Inferred from entries |
| Type Safety    | Limited                      | Full type safety      |
| Nested Support | Manual                       | Automatic             |
| IDE Support    | Basic                        | Excellent             |

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
