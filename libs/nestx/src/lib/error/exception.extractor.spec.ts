import {ForbiddenException, UnauthorizedException} from "@nestjs/common";
import {exceptionDesc, extractExceptionMessages} from "@clashsoft/nestx";

describe('ExceptionExtractor', () => {
  class ItemController {
    constructor(private readonly itemService: ItemService) {
    }

    updateOne(id: string, dto: any) {
      if (Math.random() < 0.5) {
        throw new UnauthorizedException("You must be logged in to update an item");
      }
      return this.itemService.updateOne(id, dto);
    }
  }

  class ItemService {
    updateOne(id: string, dto: any) {
      if (Math.random() < 0.5) {
        throw new ForbiddenException('This item cannot be bought, sold or used');
      }
      if (Math.random() > 0.5) {
        throw new ForbiddenException(`${id} does not own a ${dto.name}`);
      }
      // ...
    }
  }

  it('should extract list of exception', () => {
    const unauthErrors = extractExceptionMessages(UnauthorizedException, ItemController.prototype.updateOne);
    expect(unauthErrors).toEqual([
      'You must be logged in to update an item',
    ]);

    const forbiddenErrors = extractExceptionMessages(ForbiddenException, ItemController.prototype.updateOne, ItemService.prototype.updateOne);
    expect(forbiddenErrors).toEqual([
      'This item cannot be bought, sold or used',
      '${id} does not own a ${dto.name}',
    ]);
  });

  it('should join exception messages', () => {
    const errorDescription = exceptionDesc(ForbiddenException, ItemService.prototype.updateOne);
    expect(errorDescription).toEqual('- This item cannot be bought, sold or used\n- ${id} does not own a ${dto.name}');
  });
});
