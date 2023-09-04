import {ValidatedEvent} from "@clashsoft/nestx";
import {IsNotEmpty, IsString, Min} from "class-validator";
import {BadRequestException} from "@nestjs/common";

describe('ValidatedEvent', () => {
  class Dto {
    @IsString()
    @IsNotEmpty()
    foo: string;

    @Min(0)
    bar: number;
  }

  class Example {
    @ValidatedEvent()
    async example(dto: Dto) {
      return dto;
    }
  }

  it('should validate events', async () => {
    const example = new Example();
    try {
      const result = await example.example({
        foo: '',
        bar: -1,
      });
      fail(`Expected validation error, got ${JSON.stringify(result)}`);
    } catch (err: any) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.getResponse().message).toEqual([
        'foo should not be empty',
        'bar must not be less than 0',
      ]);
    }
  });
});
