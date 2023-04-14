# nestx

[![NPM version](https://badge.fury.io/js/@mean-stream%2Fnestx.svg)](https://www.npmjs.com/package/@mean-stream/nestx)

nestx is an extension package for NestJS apps.

## Installation

```
$ npm install @mean-stream/nestx
```

## Usage

Nestx provides many standalone modules that can be combined at will.

- [Events](./src/lib/event) - Simple event gateway and emitter based on NATS.
- [NotFound](./src/lib/not-found) - Converts `null` and `undefined` to `404 Not Found` errors.
- [Ref](./src/lib/ref) - Declare model properties as ObjectIds with support for Swagger, validation and populate.

## Development

### Building

Run `nx build nestx` to build the library.

### Running unit tests

Run `nx test nestx` to execute the unit tests via [Jest](https://jestjs.io).
