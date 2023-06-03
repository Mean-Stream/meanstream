import {EventRepository} from "./event.repository";

describe('EventRepository', () => {
  it('should call emit on create', async () => {
    let emitted = undefined;

    @EventRepository()
    class SimpleService {
      async create(dto: any) {
        return dto;
      }

      emit(event: string, data: any) {
        emitted = {event, data};
      }
    }

    await new SimpleService().create('a');
    expect(emitted).toStrictEqual({event: 'created', data: 'a'});
  });
})
