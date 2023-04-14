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

export function Ref(ref: string, {array, optional}: {
  array?: boolean;
  optional?: boolean;
} = {}): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Transform(array ? ({value}) => Array.isArray(value) && value.map(objectId) : ({value}) => objectId(value)),
    IsInstance(Types.ObjectId, {each: array}),
  ];

  if (optional) {
    decorators.push(IsOptional());
  }

  const mongoose = optionalRequire('@nestjs/mongoose');
  mongoose && decorators.push(mongoose.Prop({
    type: array ? [{type: Types.ObjectId, ref}] : Types.ObjectId,
    ref: array ? undefined : ref,
    required: !optional,
  }));
  const swagger = optionalRequire('@nestjs/swagger');
  swagger && decorators.push(swagger.ApiProperty({
    isArray: array,
    example: array ? [EXAMPLE_OBJECT_ID] : EXAMPLE_OBJECT_ID,
    format: 'objectid',
    required: !optional,
  }));
  return applyDecorators(...decorators);
}

export function OptionalRef(ref: string): PropertyDecorator {
  return Ref(ref, {optional: true});
}

export function RefArray(ref: string) {
  return Ref(ref, {array: true});
}
