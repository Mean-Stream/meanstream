import type {Types, Document} from 'mongoose';

type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type DTO<T> =
  T extends Types.ObjectId ? string :
    T extends Date ? string :
      T extends Array<infer U> ? Array<DTO<U>> :
        T extends object ?
          Expand<{
            [P in keyof T]: DTO<T[P]>;
          }> : T;

export type Doc<T> = T & Document<Types.ObjectId, never, T>;
