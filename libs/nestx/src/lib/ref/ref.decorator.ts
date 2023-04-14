import {applyDecorators} from '@nestjs/common';
import {optionalRequire} from '@nestjs/core/helpers/optional-require';
import {Transform} from 'class-transformer';
import {IsInstance, IsOptional} from 'class-validator';
import {Types} from 'mongoose';

function objectId<T extends string | number | Types.ObjectId | Uint8Array>(value: T): Types.ObjectId | T {
  try {
    return new Types.ObjectId(value);
  } catch (e) {
    return value;
  }
}

const EXAMPLE_OBJECT_ID = '62fc9b33773277d12d28929b';

export function Ref(ref: string): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Transform(({value}) => objectId(value)),
    IsInstance(Types.ObjectId),
  ];
  const mongoose = optionalRequire('@nestjs/mongoose');
  mongoose && decorators.push(mongoose.Prop({type: Types.ObjectId, ref, required: true}));
  const swagger = optionalRequire('@nestjs/swagger');
  swagger && decorators.push(swagger.ApiProperty({example: EXAMPLE_OBJECT_ID, format: 'objectid'}));
  return applyDecorators(...decorators);
}

export function OptionalRef(ref: string): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Transform(({value}) => objectId(value)),
    IsOptional(),
    IsInstance(Types.ObjectId),
  ];
  const mongoose = optionalRequire('@nestjs/mongoose');
  mongoose && decorators.push(mongoose.Prop({type: Types.ObjectId, ref}));
  const swagger = optionalRequire('@nestjs/swagger');
  swagger && decorators.push(swagger.ApiPropertyOptional({example: EXAMPLE_OBJECT_ID, format: 'objectid'}));
  return applyDecorators(...decorators);
}

export function RefArray(ref: string) {
  const decorators: PropertyDecorator[] = [
    Transform(({value}) => Array.isArray(value) && value.map(objectId)),
    IsInstance(Types.ObjectId, {each: true}),
  ];
  const mongoose = optionalRequire('@nestjs/mongoose');
  mongoose && decorators.push(mongoose.Prop({type: [{type: Types.ObjectId, ref}]}));
  const swagger = optionalRequire('@nestjs/swagger');
  swagger && decorators.push(swagger.ApiProperty({isArray: true, example: [EXAMPLE_OBJECT_ID], format: 'objectid'}));
  return applyDecorators(...decorators);
}
