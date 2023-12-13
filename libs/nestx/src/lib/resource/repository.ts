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
  // --------- Create ---------

  create(dto: NEW): Promise<DOC>;

  createMany(dtos: NEW[]): Promise<DOC[]>;

  // --------- Read ---------

  count(filter: FILTER): Promise<number>;

  exists(filter: FILTER): Promise<ID | undefined>;

  distinct<K extends keyof DOC>(field: K, filter: FILTER): Promise<DOC[K][]>;
  distinct(field: string, filter: FILTER): Promise<unknown[]>;

  find(id: ID): Promise<DOC | null>;

  findOne(filter: FILTER): Promise<DOC | null>;

  findAll(filter: FILTER): Promise<DOC[]>;

  // --------- Update ---------

  update(id: ID, update: UPDATE): Promise<DOC | null>;

  upsert(filter: FILTER, update: UPDATE): Promise<DOC>;

  upsertRaw(filter: FILTER, update: UPDATE): Promise<RawUpsertResult<DOC>>;

  updateOne(filter: FILTER, update: UPDATE): Promise<DOC | null>;

  updateMany(filter: FILTER, update: UPDATE): Promise<UpdateManyResult>;

  // --------- Delete ---------

  delete(id: ID): Promise<DOC | null>;

  deleteOne(filter: FILTER): Promise<DOC | null>;

  deleteMany(filter: FILTER): Promise<DeleteManyResult>;

  // --------- Other ---------

  emit?(event: string, data: DOC): void;
}
