# exact-key-map

A strongly-typed `Map` extension for TypeScript that enforces exact key/value relationships using a union-of-tuples generic and supports nested maps. Perfect for configuration objects and data structures where you want precise keys and values.

## Features

- 🔒 **Exact Key Types**: Keys are enforced exactly via union-of-tuples generics
- 🏗️ **Nested Support**: Nested entry arrays are automatically converted to nested `ExactKeyMap` instances
- 🔤 **Literal-Friendly**: Use `ExactKeyMap.fromEntries([... ] as const)` to preserve literal value types when desired
- 📦 **Zero Dependencies**: No external dependencies - lightweight and fast
- 🎯 **TypeScript First**: Built with TypeScript and provides excellent type inference
- 🧪 **Fully Tested**: Comprehensive test suite with 82 tests

## Installation

```bash
npm install exact-key-map
```

## Quick Start

```typescript
import { ExactKeyMap } from 'exact-key-map';

// Create a map using union-of-tuples generics
const userMap = new ExactKeyMap<
  [['name', string] | ['age', number] | ['isActive', boolean]]
>([
  ['name', 'Alice'],
  ['age', 30],
  ['isActive', true],
]);

userMap.get('name'); // string | undefined
userMap.get('age'); // number | undefined
userMap.get('isActive'); // boolean | undefined

userMap.set('name', 'Bob'); // ✅ Valid
userMap.set('age', 25); // ✅ Valid
userMap.set('isActive', false); // ✅ Valid
// userMap.set('invalid', 'value'); // ❌ TypeScript error

// Preserve literals when needed
const literals = ExactKeyMap.fromEntries([
  ['name', 'Alice'],
  ['age', 30],
] as const);
// name: 'Alice' | undefined, age: 30 | undefined
```

## Map Variants

### ExactKeyMap

The standard map with strict type safety - only predefined keys can be used.

## Nested Maps

```typescript
const config = new ExactKeyMap<
  [
    | [
        'database',
        [
          | ['host', string]
          | ['port', number]
          | ['credentials', [['username', string] | ['password', string]]],
        ],
      ]
    | ['api', [['baseUrl', string] | ['timeout', number]]],
  ]
>([
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
// Type: ExactKeyMap<[['host', string], ['port', number], ['credentials', ExactKeyMap<[]...]]>]> | undefined

const credentials = db?.get('credentials');
// Type: ExactKeyMap<[['username', string], ['password', string]]> | undefined

const username = credentials?.get('username');
// Type: string | undefined
```

## Extending ExactKeyMap

You can create custom classes that extend `ExactKeyMap` for domain-specific use cases:

```typescript
// Define your domain-specific types
enum Headers {
  Algorithm = 1,
  Critical = 2,
  ContentType = 3,
  KeyID = 4,
  IV = 5,
  PartialIV = 6,
  // ... more headers
}

// Define the exact entries type for your domain
type ProtectedHeadersEntries = (
  | [Headers.Algorithm, number]
  | [Headers.Critical, Headers[]]
  | [Headers.ContentType, number | Uint8Array]
  | [Headers.KeyID, Uint8Array]
  | [
      Exclude<
        Headers,
        | Headers.Algorithm
        | Headers.Critical
        | Headers.ContentType
        | Headers.KeyID
      >,
      Uint8Array | Uint8Array[] | number | number[],
    ]
)[];

// Extend ExactKeyMap with your custom class
class ProtectedHeaders extends ExactKeyMap<ProtectedHeadersEntries> {
  constructor(entries?: ProtectedHeadersEntries) {
    super(entries);
  }

  // Add domain-specific methods
  hasAlgorithm(): boolean {
    return this.has(Headers.Algorithm);
  }

  getAlgorithm(): number | undefined {
    return this.get(Headers.Algorithm);
  }

  setIV(iv: Uint8Array): this {
    return this.set(Headers.IV, iv);
  }
}

// Use your custom class - empty constructor
const headers = new ProtectedHeaders();
headers.set(Headers.Algorithm, 1);
headers.setIV(new Uint8Array([0x01, 0x02, 0x03]));

// Use your custom class - with initial data (inline)
const headersWithData = new ProtectedHeaders([
  [Headers.Algorithm, 1],
  [Headers.KeyID, new Uint8Array([0xaa, 0xbb, 0xcc])],
  [Headers.IV, new Uint8Array([0x01, 0x02, 0x03])],
]);

// Use your custom class - with initial data (non-inline, using variables)
const entries: ProtectedHeadersEntries = [
  [Headers.Algorithm, 1],
  [Headers.KeyID, new Uint8Array([0xaa, 0xbb, 0xcc])],
  [Headers.IV, new Uint8Array([0x01, 0x02, 0x03])],
];
const headersFromVariable = new ProtectedHeaders(entries);

// Type safety is preserved
const algorithm = headers.get(Headers.Algorithm); // number | undefined
const iv = headers.get(Headers.IV); // Uint8Array | Uint8Array[] | number | number[] | undefined

// Constructor with data preserves all type safety
const keyId = headersWithData.get(Headers.KeyID); // Uint8Array | undefined
```

## API Reference

### `ExactKeyMap<Entries>`

A strongly-typed Map class that extends the native `Map` with exact key typing.

#### Construction

```typescript
// Union-of-tuples generics
new ExactKeyMap<[['name', string] | ['age', number]]>([
  ['name', 'Alice'],
  ['age', 30],
]);

// Preserve literal values via const-generic factory
ExactKeyMap.fromEntries([
  ['name', 'Alice'],
  ['age', 30],
] as const);
```

- `fromEntries(entries)` creates a map from entry tuples and preserves literal value types with `as const`.

#### Methods

##### `get<K>(key: K): ValueOfKey<Entries, K> | undefined`

Retrieves a value by key with exact type inference.

```typescript
const map = new ExactKeyMap<[['name', string] | [1, boolean]]>([
  ['name', 'Alice'],
  [1, true],
]);
const name = map.get('name'); // string | undefined
const value = map.get(1); // boolean | undefined
```

##### `set<K>(key: K, value: ValueOfKey<Entries, K>): this`

Sets a value with type safety.

```typescript
const map = new ExactKeyMap<[['name', string] | [1, boolean]]>([
  ['name', 'Alice'],
  [1, true],
]);
map.set('name', 'Bob'); // ✅ Valid
map.set(1, false); // ✅ Valid
// map.set('name', 123); // ❌ TypeScript error
```

##### `delete<K>(key: K): boolean`

Removes a key-value pair with type safety.

```typescript
const map = ExactKeyMap.fromEntries([
  ['name', 'Alice'],
  [1, true],
]);
map.delete('name'); // ✅ Valid, returns true
map.delete(1); // ✅ Valid, returns true
map.delete('name'); // ✅ Valid, returns false (already deleted)
// map.delete('invalid'); // ❌ TypeScript error
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
type Entries = [['id', number], ['name', string]];
type IdValue = ValueOfKey<Entries, 'id'>; // number
type NameValue = ValueOfKey<Entries, 'name'>; // string
```

#### `AllValues<Entries>`

Creates a union of all value types from an entries array.

```typescript
type Entries = [['id', number], ['name', string], ['active', boolean]];
type Values = AllValues<Entries>; // number | string | boolean
```

#### `ExtractExactKeyMapGenerics<T>`

Extracts the generic entries parameter from an `ExactKeyMap`.

```typescript
import type { ExtractExactKeyMapGenerics } from 'exact-key-map';

type M = ExactKeyMap<
  [
    ['id', number],
    ['profile', ExactKeyMap<[['name', string], ['age', number]]>],
  ]
>;
// M => ExactKeyMap<[
//   ['id', number],
//   ['profile', ExactKeyMap<[
//     ['name', string],
//     ['age', number],
//   ]>],
// ]>

type Entries = ExtractExactKeyMapGenerics<M>;
// Entries => [
//   ['id', number],
//   ['profile', ExactKeyMap<[
//     ['name', string],
//     ['age', number],
//   ]>],
// ]
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

## Comparison with Native Map

| Feature        | Native Map                   | ExactKeyMap           |
| -------------- | ---------------------------- | --------------------- |
| Key Types      | `string \| number \| symbol` | Exact literal types   |
| Value Types    | `any`                        | Inferred from entries |
| Type Safety    | Limited                      | Full type safety      |
| Nested Support | Manual                       | Automatic             |
| IDE Support    | Basic                        | Excellent             |
| Mutability     | Mutable                      | Mutable               |

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
