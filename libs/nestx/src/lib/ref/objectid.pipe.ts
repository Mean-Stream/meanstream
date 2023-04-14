import {HttpStatus, PipeTransform} from '@nestjs/common';
import {ErrorHttpStatusCode, HttpErrorByCode} from '@nestjs/common/utils/http-error-by-code.util';
import {Types} from 'mongoose';
import {objectId, ObjectIdInput} from './objectid.helper';

export interface ObjectIdPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

function getExceptionFactory(options: ObjectIdPipeOptions) {
  const {exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST} = options;
  return exceptionFactory || (error => new HttpErrorByCode[errorHttpStatusCode](error));
}

export class ObjectIdPipe implements PipeTransform<ObjectIdInput, Types.ObjectId> {
  private readonly exceptionFactory: (error: string) => any;

  constructor(options: ObjectIdPipeOptions = {}) {
    this.exceptionFactory = getExceptionFactory(options);
  }

  transform(value: ObjectIdInput): Types.ObjectId {
    return objectId(value, this.exceptionFactory);
  }
}

export class ObjectIdArrayPipe implements PipeTransform<ObjectIdInput[], Types.ObjectId[]> {
  private readonly exceptionFactory: (error: string) => any;

  constructor(options: ObjectIdPipeOptions = {}) {
    this.exceptionFactory = getExceptionFactory(options);
  }

  transform(value: ObjectIdInput[]): Types.ObjectId[] {
    try {
      return value.map(v => new Types.ObjectId(v));
    } catch (e) {
      throw this.exceptionFactory(`Validation failed (${e.message})`);
    }
  }
}

export class OptionalObjectIdPipe implements PipeTransform<ObjectIdInput | null | undefined, Types.ObjectId | null | undefined> {
  private readonly exceptionFactory: (error: string) => any;

  constructor(options: ObjectIdPipeOptions = {}) {
    this.exceptionFactory = getExceptionFactory(options);
  }

  transform(value: ObjectIdInput | null | undefined): Types.ObjectId | null | undefined {
    if (value === null || value === undefined) {
      return value as null | undefined;
    }
    return objectId(value, this.exceptionFactory);
  }
}
