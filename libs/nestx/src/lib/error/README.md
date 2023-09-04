# Errors

The error module provides a simple way to handle errors and document them with Swagger.

## NotFound

The `@NotFound` decorator automatically decorates an endpoint with `@ApiNotFoundResponse` with `@nestjs/swagger` is available.
It converts return values `null` and `undefined` to a `404 Not Found` error.
In addition, the `notFound` function can be used like this:

```ts
const something = await findOne(id) ?? notFound(id);
```

If `findOne` returns `Something | null`, the type of `something` will be inferred as `Something`.

## Exception Extractor

The exception extractor helpers can be used to extract exceptions from code.

```ts
import {exceptionDesc} from "./exception.extractor";
import {ForbiddenException} from "@nestjs/common";
import {ApiUnauthorizedResponse} from "@nestjs/swagger";

class ItemController {
  constructor(private readonly itemService: ItemService) {
  }

  @ApiUnauthorizedResponse({
    description: exceptionDesc(UnauthorizedException, ItemController.prototype.updateOne, ItemService.prototype.updateOne),
    // => - You must be logged in to update an item
  })
  @ApiForbiddenResponse({
    description: exceptionDesc(ForbiddenException, ItemController.prototype.updateOne, ItemService.prototype.updateOne),
    // => - This item cannot be bought, sold or used
  })
  updateOne(id: string, updateItemDto: UpdateItemDto) {
    if (!isLoggedIn()) {
      throw new UnauthorizedException('You must be logged in to update an item');
    }
    return this.itemService.updateOne(id, updateItemDto);
  }
}

class ItemService {
  updateOne(id: string, updateItemDto: UpdateItemDto) {
    if (!isTradeable(id)) {
      throw new ForbiddenException('This item cannot be bought, sold or used');
    }
    // ...
  }
}
```
