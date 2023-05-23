import {applyDecorators} from '@nestjs/common';
import {optionalRequire} from '@nestjs/core/helpers/optional-require';
import {Transform} from 'class-transformer';
import {IsInstance, IsOptional} from 'class-validator';
import {IndexDefinition, IndexDirection, Types} from 'mongoose';
import {objectId} from './objectid.helper';
import type {PropOptions} from '@nestjs/mongoose';

const EXAMPLE_OBJECT_ID = '62fc9b33773277d12d28929b';

export type RefOptions = {
  array?: boolean;
  optional?: boolean;
  index?: boolean | IndexDirection | IndexDefinition;
};

export function Ref(ref: string, {array, optional, index}: RefOptions = {}): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Transform(array ? ({value}) => Array.isArray(value) && value.map(objectId) : ({value}) => objectId(value)),
    IsInstance(Types.ObjectId, {each: array}),
  ];

  if (optional) {
    decorators.push(IsOptional());
  }

  const mongoose = optionalRequire('@nestjs/mongoose');
  if (mongoose) {
    const propOptions: PropOptions = array ? {
      type: [{type: Types.ObjectId, ref}],
      required: !optional,
    } : {
      type: Types.ObjectId,
      ref,
      required: !optional,
    };
    if (index) {
      propOptions.index = index;
    }
    decorators.push(mongoose.Prop(propOptions));
  }
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
