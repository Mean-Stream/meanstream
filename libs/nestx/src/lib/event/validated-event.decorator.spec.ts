import {BadRequestException} from '@nestjs/common';
import {IsNotEmpty, IsString, Min} from 'class-validator';
import {ValidatedEvent} from './validated-event.decorator';

describe('ValidatedEvent', () => {
  class Dto {
    @IsString()
    @IsNotEmpty()
    foo: string;

    @Min(0)
    bar: number;
  }

  class Example {
    @ValidatedEvent({transform: true})
    async example(dto: Dto) {
      return dto;
    }
  }

  it('should transform DTOs', async () => {
    const example = new Example();
    const result = await example.example({
      foo: 'foo',
      bar: 42,
    });
    expect(result).toBeInstanceOf(Dto);
  });

  it('should create BadRequestExceptions', async () => {
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
