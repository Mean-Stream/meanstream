import {Type} from "@nestjs/common";

/**
 * Looks through the body of all functions, finds expressions of the form
 * ```js
 * throw new <type>('<message>')
 * ```
 * and returns the messages as an array.
 * Single- and double-quoted strings and template literals (without line breaks or nested string expressions) are
 * supported.
 *
 * @param type the exception type to look for
 * @param functions the functions to look through
 *
 * @return the messages
 *
 * @example
 * ```js
 * class ItemController {
 *   constructor(private readonly itemService: ItemService) {}
 *   updateOne(id: string, updateItemDto: UpdateItemDto) {
 *     if (!isLoggedIn()) {
 *       throw new UnauthorizedException('You must be logged in to update an item');
 *     }
 *     return this.itemService.updateOne(id, updateItemDto);
 *   }
 * }
 * class ItemService {
 *   updateOne(id: string, updateItemDto: UpdateItemDto) {
 *     if (!isTradeable(id)) {
 *       throw new ForbiddenException('This item cannot be bought, sold or used');
 *     }
 *     // ...
 *   }
 * }
 *
 * extractExceptionMessages(ForbiddenException, ItemController.prototype.updateOne, ItemService.prototype.updateOne)
 * // => ['This item cannot be bought, sold or used']
 * ```
 */
export function extractExceptionMessages<T extends Error>(type: Type<T>, ...functions: ((...args: any[]) => any)[]): string[] {
  const result: string[] = [];
  for (const func of functions) {
    for (const match of func.toString().matchAll(/throw new ([\w.]+)\(('[^']+'|"[^"]+|`[^`]+`")\)/g)) {
      if (match[1].endsWith(type.name)) {
        result.push(match[2].slice(1, -1));
      }
    }
  }
  return result;
}

/**
 * Joins exception messages from multiple functions as a markdown list.
 *
 * @see extractExceptionMessages
 * @param type the exception type to look for
 * @param functions the functions to look through
 *
 * @return the messages as a markdown list
 *
 * @example
 * ```js
 * exceptionDesc(ForbiddenException, ItemController.prototype.updateOne, ItemService.prototype.updateOne)
 * // => '- This item cannot be bought, sold or used'
 */
export function exceptionDesc<T extends Error>(type: Type<T>, ...functions: ((...args: any[]) => any)[]): string {
  return '- ' + extractExceptionMessages(type, ...functions).join('\n- ');
}
