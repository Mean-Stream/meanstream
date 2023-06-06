import {EventRepository} from "./event.repository";
import {DeleteManyResult, RawUpsertResult, UpdateManyResult} from "../resource/repository";

describe('EventRepository', () => {
  let emitted = undefined;

  @EventRepository()
  class SimpleService {
    async findAll(filter: any) {
      return [filter];
    }

    async create(dto: any) {
      return dto;
    }

    async update(id: any, dto: any) {
      return {...dto, id};
    }

    async upsertRaw(filter: any, update: any): Promise<RawUpsertResult<any>> {
      return {operation: 'created', result: {...filter, ...update}};
    }

    async updateMany(filter: any, update: any): Promise<UpdateManyResult> {
      return {acknowledged: true, matchedCount: 1, upsertedCount: 0, modifiedCount: 1};
    }

    async deleteMany(filter: any): Promise<DeleteManyResult> {
      return {acknowledged: true, deletedCount: 1};
    }

    async delete(id: any) {
      return {id};
    }

    async saveAll(docs: any[]) {
      return docs;
    }

    async deleteAll(docs: any[]) {
      return docs;
    }

    emit(event: string, data: any) {
      emitted = {event, data};
    }
  }

  const service = new SimpleService();

  it('should call emit on create', async () => {
    await service.create({a: 'a'});
    expect(emitted).toStrictEqual({event: 'created', data: {a: 'a'}});
  });

  it('should call emit on update', async () => {
    await service.update(1, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'updated', data: {id: 1, a: 'a'}});
  });

  it('should call emit on delete', async () => {
    await service.delete(1);
    expect(emitted).toStrictEqual({event: 'deleted', data: {id: 1}});
  });

  it('should call emit on upsert', async () => {
    await service.upsertRaw({id: 1}, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'created', data: {id: 1, a: 'a'}});
  });

  it('should call emit on update many', async () => {
    await service.updateMany({id: 1}, {a: 'a'});
    expect(emitted).toStrictEqual({event: 'updated', data: {id: 1}});
  });

  it('should call emit on delete many', async () => {
    await service.deleteMany({id: 1});
    expect(emitted).toStrictEqual({event: 'deleted', data: {id: 1}});
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
