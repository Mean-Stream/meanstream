import {EventRepository} from "./event.repository";
import {RawUpsertResult} from "../resource/repository";

describe('EventRepository', () => {
  let emitted = undefined;

  @EventRepository()
  class SimpleService {
    async create(dto: any) {
      return dto;
    }

    async update(id: any, dto: any) {
      return {...dto, id};
    }

    async upsertRaw(filter: any, update: any): Promise<RawUpsertResult<any>> {
      return {operation: 'created', result: {...filter, ...update}};
    }

    async delete(id: any) {
      return {id};
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
