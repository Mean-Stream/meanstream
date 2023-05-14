import {Types} from 'mongoose';
import {toByteArray, fromByteArray} from 'base64-js';

export type ObjectIdInput = string | number | Types.ObjectId | Uint8Array;

/**
 * Convert ObjectId to url-safe base64
 * @param value ObjectId
 */
export function objectIdToBase64(value: Types.ObjectId): string {
  return fromByteArray(value.id).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function objectId<T extends ObjectIdInput>(value: T): Types.ObjectId | T
export function objectId(value: ObjectIdInput, exceptionFactory: (error: string) => any): Types.ObjectId
/**
 * Convert string (hex or regular base64 or url-safe base64), number, byte array or ObjectId to ObjectId
 * @param value string, number, byte array or ObjectId
 * @param exceptionFactory optional function to throw an exception
 * @returns ObjectId or original value if invalid and no exceptionFactory
 */
export function objectId<T extends ObjectIdInput>(value: T, exceptionFactory?: (error: string) => any): Types.ObjectId | T {
  try {
    if (typeof value === 'string' && value.length === 16) {
      // NB: Avoid ObjectId.createFromBase64 because it returns a mongodb.ObjectId, not mongoose.Types.ObjectId
      return new Types.ObjectId(toByteArray(value));
    }
    return new Types.ObjectId(value);
  } catch (e) {
    if (exceptionFactory) {
      throw exceptionFactory(`Validation failed (${e.message})`);
    } else {
      return value;
    }
  }
}
