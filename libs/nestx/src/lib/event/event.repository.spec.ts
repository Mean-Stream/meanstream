import {EventRepository} from "./event.repository";
import {DeleteManyResult, RawUpsertResult, Repository, UpdateManyResult} from "../resource/repository";

describe('EventRepository', () => {
  let emitted = undefined;

  class Simple {
    id: number;
    a: string;
  }

  type NewSimple = Omit<Simple, 'id'>;
  type SimpleFilter = Partial<Simple>;

  @EventRepository()
  class SimpleService implements Repository<number, Simple, NewSimple, SimpleFilter, NewSimple> {
    async find(): Promise<Simple | null> {
      return null;
    }

    async findOne(): Promise<Simple | null> {
      return null;
    }

    async findAll() {
      return [{id: 1, a: 'a'}];
    }

    async exists(): Promise<number | undefined> {
      return;
    }

    async distinct(): Promise<unknown[]> {
      return [];
    }

    async create(dto: NewSimple) {
      return {...dto, id: 1};
    }

    async createMany(dtos: NewSimple[]): Promise<Simple[]> {
      return dtos.map((dto, i) => ({...dto, id: i}));
    }

    async update(id: number, dto: NewSimple) {
      return {...dto, id};
    }

    async updateOne(_: SimpleFilter, update: NewSimple): Promise<Simple | null> {
      return {id: 1, ...update};
    }

    async upsert(_: SimpleFilter, update: NewSimple): Promise<Simple> {
      return {id: 1, ...update};
    }

    async upsertRaw(filter: SimpleFilter, update: NewSimple): Promise<RawUpsertResult<Simple>> {
      return {operation: 'created', result: {id: 1, ...filter, ...update}};
    }

    async updateMany(filter: SimpleFilter, update: NewSimple): Promise<UpdateManyResult> {
      return {acknowledged: true, matchedCount: 1, upsertedCount: 0, modifiedCount: 1};
    }

    async deleteOne(filter: SimpleFilter): Promise<Simple | null> {
      return null;
    }

    async deleteMany(filter: SimpleFilter): Promise<DeleteManyResult> {
      return {acknowledged: true, deletedCount: 1};
    }

    async delete(id: number) {
      return {id, a: ''};
    }

    async saveAll(docs: Simple[]) {
      return docs;
    }

    async deleteAll(docs: Simple[]) {
      return docs;
    }

    emit(event: string, data: Simple) {
      emitted = {event, data};
    }
  }

  const service = new SimpleService();

  it('should call emit on create', async () => {
    await service.create({a: 'a'});
    expect(emitted).toStrictEqual({event: 'created', data: {id: 1, a: 'a'}});
  });

  it('should call emit on update', async () => {
    await service.update(1, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'updated', data: {id: 1, a: 'a'}});
  });

  it('should call emit on updateOne', async () => {
    await service.updateOne({id: 1}, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'updated', data: {id: 1, a: 'a'}});
  });

  it('should call emit on delete', async () => {
    await service.delete(1);
    expect(emitted).toStrictEqual({event: 'deleted', data: {id: 1, a: ''}});
  });

  it('should call emit on deleteOne', async () => {
    await service.deleteOne({id: 1});
    expect(emitted).toStrictEqual({event: 'deleted', data: {id: 1, a: ''}});
  });

  it('should call emit on upsertRaw', async () => {
    await service.upsertRaw({id: 1}, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'created', data: {id: 1, a: 'a'}});
  });

  it('should call emit on create many', async () => {
    const result = await service.createMany([{a: 'a'}]);
    expect(emitted).toStrictEqual({event: 'created', data: {id: 0, a: 'a'}});
  });

  it('should call emit on update many', async () => {
    await service.updateMany({id: 1}, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'updated', data: {id: 1, a: 'a'}});
  });

  it('should call emit on delete many', async () => {
    await service.deleteMany({id: 1});
    expect(emitted).toStrictEqual({event: 'deleted', data: {id: 1, a: 'a'}});
  });

  it('should call emit on save all', async () => {
    let input: any[] = [{id: 1, isNew: true, isModified: () => false}];
    let result = await service.saveAll(input);
    expect(result).toStrictEqual(input);
    expect(emitted).toStrictEqual({event: 'created', data: input[0]});

    input = [{id: 1, isModified: () => true}];
    result = await service.saveAll(input);
    expect(result).toStrictEqual(input);
    expect(emitted).toStrictEqual({event: 'updated', data: input[0]});
  });

  it('should call emit on delete all', async () => {
    const input: any[] = [{id: 1}];
    const result = await service.deleteAll(input);
    expect(result).toStrictEqual(input);
    expect(emitted).toStrictEqual({event: 'deleted', data: input[0]});
  });

  class BaseService {
    async create(dto: any) {
      return dto;
    }
  }

  @EventRepository()
  class ExtendedService extends BaseService {
    emit(event: string, data: any) {
      emitted = {event, data};
    }
  }

  it('should call emit for derived methods', async () => {
    const service = new ExtendedService();
    await service.create({a: 'a'});
    expect(emitted).toStrictEqual({event: 'created', data: {a: 'a'}});
  });
});
