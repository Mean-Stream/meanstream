import {Types} from 'mongoose';

export type ObjectIdInput = string | number | Types.ObjectId | Uint8Array;

export function objectId<T extends ObjectIdInput>(value: T): Types.ObjectId | T
export function objectId<T extends ObjectIdInput>(value: T, exceptionFactory: (error: string) => any): Types.ObjectId
export function objectId<T extends ObjectIdInput>(value: T, exceptionFactory?: (error: string) => any): Types.ObjectId | T {
  try {
    return new Types.ObjectId(value);
  } catch (e) {
    if (exceptionFactory) {
      throw exceptionFactory(`Validation failed (${e.message})`);
    } else {
      return value;
    }
  }
}
