# nestx

[![NPM version](https://badge.fury.io/js/@mean-stream%2Fnestx.svg)](https://www.npmjs.com/package/@mean-stream/nestx)

nestx is an extension package for NestJS apps.

## Installation

```
$ npm install @mean-stream/nestx
```

## Usage

Nestx provides many standalone modules that can be combined at will.

- [Events](./src/lib/event) - `@mean-stream/nestx/event` - Simple event gateway and emitter based on NATS.
- [Errors](./src/lib/error) - `@mean-stream/nestx/error` (formerly `@mean-stream/nestx/not-found`) - Simplified error handling and documentation with Swagger.
- [Ref](./src/lib/ref) - `@mean-stream/nestx/ref` - Declare model properties as ObjectIds with support for Swagger, validation and populate.
- [Resource](./src/lib/resource) - `@mean-stream/nestx/resource` - Helpers for CRUD services and controllers.

Submodules can be imported individually or all at once:

```ts
import {EventModule, NotFound, Ref} from '@mean-stream/nestx';
// or
import {EventModule} from '@mean-stream/nestx/event';
import {NotFound} from '@mean-stream/nestx/not-found';
import {Ref} from '@mean-stream/nestx/ref';
```

The second form is preferred if you want to avoid some optional dependencies.
Keep in mind that it requires `"moduleResolution": "NodeNext"` in your `tsconfig.json`.

## Development

### Building

Run `nx build nestx` to build the library.

### Running unit tests

Run `nx test nestx` to execute the unit tests via [Jest](https://jestjs.io).
