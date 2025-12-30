import type {Binary, Decimal128, ObjectId, Timestamp, UUID, BSONSymbol} from 'bson';
import type {Document, Types} from 'mongoose';

type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type DTOBecomesDecimal128 =
  | Decimal128 | Types.Decimal128;
export type DTOBecomesTimestamp =
  | Timestamp;
export type DTOBecomesString =
  | ObjectId | Types.ObjectId
  | Binary | Types.Buffer
  | UUID | Types.UUID // subclasses of Binary, but included if that changes.
  | Date
  | BSONSymbol
  | {toJSON(): string}
  ;

export type DTO<T> =
  T extends DTOBecomesString ? string
    : T extends DTOBecomesDecimal128 ? { $numberDecimal: string }
      : T extends DTOBecomesTimestamp ? { $timestamp: string }
        : T extends Document<infer U> ? DTO<U>
          : T extends Array<infer U> ? Array<DTO<U>>
            : T extends object ? Expand<{ [P in keyof T]: DTO<T[P]> }>
              : T;

export type Doc<T, ID = Types.ObjectId, HELP = object> = T & Document<ID, HELP, T>;
