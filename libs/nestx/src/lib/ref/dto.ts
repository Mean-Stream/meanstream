import type {Types, Document} from 'mongoose';

export type DTO<T> = {
  [P in keyof T]:
  T[P] extends Types.ObjectId ? string :
  T[P] extends Types.ObjectId[] ? string[] :
  T[P];
} & { _id: string };

export type Doc<T> = T & Document<Types.ObjectId, never, T>;
