import type {Document, FilterQuery, Model, QueryOptions, Types, UpdateQuery, UpdateWriteOpResult} from "mongoose";
import {Doc} from "../ref";
import {DeleteManyResult, RawUpsertResult, Repository} from "./repository";

export class MongooseRepository<T, ID = Types.ObjectId, DOC = Doc<T, ID>>
  implements Repository<T, ID, DOC, FilterQuery<T>, UpdateQuery<T>> {
  constructor(
    protected readonly model: Model<T, object, object, object, DOC>,
  ) {
  }

  async create(dto: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<DOC> {
    return this.model.create(dto);
  }

  async find(id: ID, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findById(id, undefined, options).exec();
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findOne(filter, undefined, options).exec();
  }

  async findAll(filter?: FilterQuery<T>, options?: QueryOptions<T>): Promise<DOC[]> {
    return this.model.find(filter, undefined, options).exec();
  }

  async update(id: ID, update: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<DOC | null> {
    return this.model.findByIdAndUpdate(id, update, {...options, new: true}).setOptions(options).exec();
  }

  async upsert(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<DOC> {
    return (await this.upsertRaw(filter, update, options)).result;
  }

  async upsertRaw(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<RawUpsertResult<DOC>> {
    const result = await this.model.findOneAndUpdate(filter, update, {
      ...options,
      new: true,
      upsert: true,
      rawResult: true
    }).exec();
    if (result.lastErrorObject.upserted) {
      return {operation: 'created', result: result.value};
    } else {
      return {operation: 'updated', result: result.value};
    }
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<DOC | null> {
    return this.model.findOneAndUpdate(filter, update, {...options, new: true}).exec();
  }

  async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update, {...options, new: true}).exec();
  }

  async delete(id: ID, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findByIdAndDelete(id, options);
  }

  async deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findOneAndDelete(filter, options);
  }

  async deleteMany(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<DeleteManyResult> {
    return this.model.deleteMany(filter, options).exec();
  }

  // TODO may specify a better return type
  async saveAll(docs: DOC[]): Promise<void> {
    await this.model.bulkSave(docs as Document[]);
  }

  async deleteAll(items: (T & {_id: ID})[]): Promise<DeleteManyResult> {
    return this.model.deleteMany({_id: {$in: items.map(i => i._id)}});
  }
}
