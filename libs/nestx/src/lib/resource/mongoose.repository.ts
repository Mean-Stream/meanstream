import type {
  CreateOptions,
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import {Doc} from "../ref";
import {DeleteManyResult, RawUpsertResult, Repository} from "./repository";

export class MongooseRepository<T,
  ID = Types.ObjectId,
  DOC = Doc<T, ID>,
  NEW = Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
  FILTER = FilterQuery<T>,
  UPDATE = UpdateQuery<T>,
>
  implements Repository<ID, DOC, NEW, FILTER, UPDATE> {
  constructor(
    protected readonly model: Model<T, object, object, object, DOC>,
  ) {
  }

  // --------- Create ---------

  async create(dto: NEW, options?: CreateOptions): Promise<DOC> {
    if (options) {
      return this.model.create([dto], options).then(docs => docs[0]);
    } else {
      return this.model.create(dto);
    }
  }

  async createMany(dtos: NEW[], options?: CreateOptions): Promise<DOC[]> {
    return this.model.create(dtos, options);
  }

  // --------- Read ---------

  async count(filter: FILTER, options?: QueryOptions<T>): Promise<number> {
    return this.model.countDocuments(filter, options).exec();
  }

  async exists(filter: FILTER, options?: QueryOptions<T>): Promise<ID | undefined> {
    return (await this.model.exists(filter).setOptions(options).exec())?._id as ID;
  }

  distinct<K extends keyof DOC>(field: K, filter: FILTER, options?: QueryOptions<T>): Promise<DOC[K][]>;
  async distinct(field: string, filter: FILTER, options?: QueryOptions<T>): Promise<unknown[]> {
    return this.model.distinct(field, filter).setOptions(options).exec();
  }

  async find(id: ID, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findById(id, undefined, options).exec();
  }

  async findOne(filter: FILTER, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findOne(filter, undefined, options).exec();
  }

  async findAll(filter?: FILTER, options?: QueryOptions<T>): Promise<DOC[]> {
    return this.model.find(filter, undefined, options).exec();
  }

  // --------- Update ---------

  async update(id: ID, update: UPDATE, options: QueryOptions<T> = {}): Promise<DOC | null> {
    return this.model.findByIdAndUpdate(id, update, {...options, new: true}).setOptions(options).exec();
  }

  async upsert(filter: FILTER, update: UPDATE, options: QueryOptions<T> = {}): Promise<DOC> {
    return (await this.upsertRaw(filter, update, options)).result;
  }

  async upsertRaw(filter: FILTER, update: UPDATE, options: QueryOptions<T> = {}): Promise<RawUpsertResult<DOC>> {
    const result = await this.model.findOneAndUpdate(filter, update, {
      ...options,
      new: true,
      upsert: true,
      includeResultMetadata: true,
    }).exec();
    if (result.lastErrorObject?.upserted) {
      return {operation: 'created', result: result.value};
    } else {
      return {operation: 'updated', result: result.value};
    }
  }

  async updateOne(filter: FILTER, update: UPDATE, options: QueryOptions<T> = {}): Promise<DOC | null> {
    return this.model.findOneAndUpdate(filter, update, {...options, new: true}).exec();
  }

  async updateMany(filter: FILTER, update: UPDATE, options: QueryOptions<T> = {}): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update, {...options, new: true}).exec();
  }

  // --------- Delete ---------

  async delete(id: ID, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findByIdAndDelete(id, options);
  }

  async deleteOne(filter: FILTER, options?: QueryOptions<T>): Promise<DOC | null> {
    return this.model.findOneAndDelete(filter, options);
  }

  async deleteMany(filter: FILTER, options?: QueryOptions<T>): Promise<DeleteManyResult> {
    return this.model.deleteMany(filter, options).exec();
  }

  // --------- Other ---------

  async save(doc: DOC, options?: SaveOptions): Promise<void> {
    await (doc as Document).save(options);
  }

  // TODO may specify a better return type
  async saveAll(docs: DOC[], options?: Parameters<Model<T>['bulkSave']>[1]): Promise<void> {
    await this.model.bulkSave(docs as Document[], options);
  }

  async deleteAll(items: (T & {_id: ID})[], options?: QueryOptions<T>): Promise<DeleteManyResult> {
    return this.model.deleteMany({_id: {$in: items.map(i => i._id)}}, options);
  }
}
