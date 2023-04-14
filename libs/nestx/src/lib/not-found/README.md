# NotFound

The `@NotFound` decorator automatically decorates an endpoint with `@ApiNotFoundResponse` with `@nestjs/swagger` is available.
It converts return values `null` and `undefined` to a `404 Not Found` error.
In addition, the `notFound` function can be used like this:

```ts
const something = await findOne(id) ?? notFound(id);
```

If `findOne` returns `Something | null`, the type of `something` will be inferred as `Something`.
