# exact-key-map

A strongly-typed `Map` extension for TypeScript that enforces exact key/value relationships using a union-of-tuples generic and supports nested maps. Perfect for configuration objects and data structures where you want precise keys and values.

## Features

- 🔒 **Exact Key Types**: Keys are enforced exactly via union-of-tuples generics
- 🏗️ **Nested Support**: Nested entry arrays are automatically converted to nested `ExactKeyMap` instances
- 🔤 **Literal-Friendly**: Use `new ExactKeyMap([... ] as const)` to preserve literal value types when desired
- 📦 **Zero Dependencies**: No external dependencies - lightweight and fast
- 🎯 **TypeScript First**: Built with TypeScript and provides excellent type inference
- 🔁 **Native Map Export**: Convert to a plain `Map` with `asMap()`
- 🧪 **Fully Tested**: Comprehensive test suite with 82 tests

## Installation

```bash
npm install exact-key-map
```

## Quick Start

```typescript
import { ExactKeyMap } from 'exact-key-map';

// Create a map using union-of-tuples generics (via Es)
type UserEntries = Es<
  ['name', string] | ['age', number] | ['isActive', boolean]
>;
const userMap = new ExactKeyMap<UserEntries>([
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
const literals = new ExactKeyMap([
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
type CredentialsEntries = Es<['username', string] | ['password', string]>;
type DatabaseEntries = Es<
  ['host', string] | ['port', number] | ['credentials', CredentialsEntries]
>;
type ApiEntries = Es<['baseUrl', string] | ['timeout', number]>;
type ConfigEntries = Es<['database', DatabaseEntries] | ['api', ApiEntries]>;

const config = new ExactKeyMap<ConfigEntries>([
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
// Type: ExactKeyMap<ReadonlyArray<
//   ['host', string] |
//   ['port', number] |
//   ['credentials', ExactKeyMap<ReadonlyArray<
//     ['username', string] |
//     ['password', string]
//   >>]
// >> | undefined

const credentials = db?.get('credentials');
// Type: ExactKeyMap<ReadonlyArray<
//   ['username', string] |
//   ['password', string]
// >> | undefined

const username = credentials?.get('username');
// Type: string | undefined
```

You can also convert any `ExactKeyMap` (including nested structures) into native `Map` instances using `asMap()`:

```typescript
const plain = config.asMap();
const dbMap = plain.get('database'); // native Map
const credMap = (dbMap as Map<string, unknown>).get('credentials') as Map<
  string,
  unknown
>;
console.log(credMap.get('username')); // 'admin'
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
type ProtectedHeadersEntries = Es<
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
>;

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
// Union-of-tuples generics via Es
type Entries = Es<['name', string] | ['age', number]>;
new ExactKeyMap<Entries>([
  ['name', 'Alice'],
  ['age', 30],
]);

// Preserve literal values via const-generic factory
new ExactKeyMap([
  ['name', 'Alice'],
  ['age', 30],
] as const);
```

- Passing `entries` with `as const` to the constructor preserves literal value types.

#### Methods

##### `get<K>(key: K): ValueOfKey<Entries, K> | undefined`

Retrieves a value by key with exact type inference.

```typescript
type Entries = Es<['name', string] | [1, boolean]>;
const map = new ExactKeyMap<Entries>([
  ['name', 'Alice'],
  [1, true],
]);
const name = map.get('name'); // string | undefined
const value = map.get(1); // boolean | undefined
```

##### `set<K>(key: K, value: ValueOfKey<Entries, K>): this`

Sets a value with type safety.

```typescript
type Entries = Es<['name', string] | [1, boolean]>;
const map = new ExactKeyMap<Entries>([
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
const map = new ExactKeyMap([
  ['name', 'Alice'],
  [1, true],
] as const);
map.delete('name'); // ✅ Valid, returns true
map.delete(1); // ✅ Valid, returns true
map.delete('name'); // ✅ Valid, returns false (already deleted)
// map.delete('invalid'); // ❌ TypeScript error
```

##### `asMap(): Map<KeysOfEntries<Entries>, AllValues<Entries>>`

Converts the `ExactKeyMap` to a plain JavaScript `Map`. If any values are nested `ExactKeyMap` instances, they are recursively converted to plain `Map`s as well.

```typescript
type Entries = Es<['name', string] | ['age', number]>;
const exact = new ExactKeyMap<Entries>([
  ['name', 'Alice'],
  ['age', 30],
]);

const plain = exact.asMap();
plain.get('name'); // 'Alice'
plain.get('age'); // 30
```

Nested structures are also converted all the way down:

```typescript
type Level3Es = Es<['value', string]>;
type Level2Es = Es<['level3', Level3Es] | ['count', number]>;
type Level1Es = Es<['level2', Level2Es] | ['title', string]>;
type NestedEntries = Es<['level1', Level1Es] | ['root', boolean]>;

const nested = new ExactKeyMap<NestedEntries>([
  [
    'level1',
    [
      [
        'level2',
        [
          ['level3', [['value', 'deep']]],
          ['count', 42],
        ],
      ],
      ['title', 'Nested'],
    ],
  ],
  ['root', true],
]);

const rootMap = nested.asMap(); // native Map
const level1 = rootMap.get('level1') as Map<string, unknown>;
const level2 = level1.get('level2') as Map<string, unknown>;
const level3 = level2.get('level3') as Map<string, unknown>;
level3.get('value'); // 'deep'
```

### Type Utilities

Type utilities operate on entry lists represented as `Es<...>` (a `ReadonlyArray` of union-of-entry tuples).

#### `Es<Entries>`

Represents a readonly array of entry tuples. Each entry tuple is a key/value pair `['key', Value]`. Use `Es` to define the entries for `ExactKeyMap`, including nested structures.

```typescript
// Basic entries
type Entries = Es<['id', number] | ['name', string]>;
const map = new ExactKeyMap<Entries>([
  ['id', 1],
  ['name', 'Alice'],
]);

// Nested entries
type CredentialsEntries = Es<['username', string] | ['password', string]>;
type DatabaseEntries = Es<
  ['host', string] | ['port', number] | ['credentials', CredentialsEntries]
>;
type ConfigEntries = Es<['database', DatabaseEntries]>;
const config = new ExactKeyMap<ConfigEntries>([
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
]);
```

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
  ReadonlyArray<
    | ['id', number]
    | [
        'profile',
        ExactKeyMap<ReadonlyArray<['name', string] | ['age', number]>>,
      ]
  >
>;
// M => ExactKeyMap<ReadonlyArray<
//   | ['id', number]
//   | [
//       'profile',
//       ExactKeyMap<ReadonlyArray<['name', string] | ['age', number]>>
//     ]
// >>

type Entries = ExtractExactKeyMapGenerics<M>;
// Entries => ReadonlyArray<
//   | ['id', number]
//   | [
//       'profile',
//       ExactKeyMap<ReadonlyArray<['name', string] | ['age', number]>>
//     ]
// >
```

### Utility Functions

#### `isEntries(value: unknown): value is Es<Entry>`

Checks if a value is an array of entry tuples.

```typescript
isEntries([
  ['name', 'Alice'],
  [1, true],
]); // true
isEntries(['not-a-tuple']); // false
```

#### `isEntry(value: unknown): value is Entry`

Checks if a value is a 2-length entry tuple.

```typescript
isEntry([1, 2]); // true
isEntry(['a', 'b']); // true
isEntry([1]); // false
isEntry([1, 2, 3]); // false
isEntry('string'); // false
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
