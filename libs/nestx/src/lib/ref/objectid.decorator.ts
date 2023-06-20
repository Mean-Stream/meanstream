import {IsInstance, ValidationOptions} from "class-validator";
import {Types} from "mongoose";
import {Transform, TransformOptions} from "class-transformer";
import {applyDecorators} from "@nestjs/common";
import {objectId} from "./objectid.helper";

export function IsObjectId(validationOptions?: ValidationOptions) {
  return IsInstance(Types.ObjectId, validationOptions);
}

function TransformObjectId(array = false, transformOptions?: TransformOptions) {
  return Transform(
    array
      // NB: obj[key] instead of value
      // See https://github.com/typestack/class-transformer/issues/484#issuecomment-755872178
      ? ({obj, key}) => Array.isArray(obj[key]) && obj[key].map(objectId)
      : ({obj, key}) => objectId(obj[key]),
    transformOptions,
  );
}

export function AsObjectId(validationOptions?: ValidationOptions, transformOptions?: TransformOptions): PropertyDecorator {
  return applyDecorators(
    TransformObjectId(validationOptions?.each, transformOptions),
    IsObjectId(validationOptions),
  );
}
