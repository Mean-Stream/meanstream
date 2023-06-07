export interface UpdateManyResult {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
}

export interface RawUpsertResult<DOC> {
  operation: 'created' | 'updated',
  result: DOC;
}

export interface DeleteManyResult {
  acknowledged: boolean;
  deletedCount: number;
}

export interface Repository<ID, DOC, NEW, FILTER, UPDATE> {
  create(dto: NEW): Promise<DOC>;

  find(id: ID): Promise<DOC | null>;

  findOne(filter: FILTER): Promise<DOC | null>;

  findAll(filter: FILTER): Promise<DOC[]>;

  update(id: ID, update: UPDATE): Promise<DOC | null>;

  upsert(filter: FILTER, update: UPDATE): Promise<DOC>;

  upsertRaw(filter: FILTER, update: UPDATE): Promise<RawUpsertResult<DOC>>;

  updateOne(filter: FILTER, update: UPDATE): Promise<DOC | null>;

  updateMany(filter: FILTER, update: UPDATE): Promise<UpdateManyResult>;

  delete(id: ID): Promise<DOC | null>;

  deleteOne(filter: FILTER): Promise<DOC | null>;

  deleteMany(filter: FILTER): Promise<DeleteManyResult>;

  emit?(event: string, data: DOC): void;
}
