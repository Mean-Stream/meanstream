export interface UpdateManyResult {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
}

export interface RawUpsertResult<DOC> {
  operation: 'created' | 'updated',
  result: DOC | null;
}

export interface DeleteManyResult {
  acknowledged: boolean;
  deletedCount: number;
}

export interface Repository<T, ID, DOC, FILTER, UPDATE> {
  create(dto: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<DOC>;

  findOne(id: ID): Promise<DOC | null>;

  findAll(filter: FILTER): Promise<DOC[]>;

  update(id: ID, update: UPDATE): Promise<DOC | null>;

  upsert(filter: FILTER, update: UPDATE): Promise<DOC | null>;

  upsertRaw(filter: FILTER, update: UPDATE): Promise<RawUpsertResult<DOC>>;

  updateMany(filter: FILTER, update: UPDATE): Promise<UpdateManyResult>;

  delete(id: ID): Promise<DOC | null>;

  deleteMany(filter: FILTER): Promise<DeleteManyResult>;
}
