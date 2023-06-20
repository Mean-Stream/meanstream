import {AsObjectId} from './objectid.decorator';
import {Types} from 'mongoose';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';

describe('ObjectIdDecorators', () => {
  it('should convert POJO to class instance', async () => {
    class MyClass {
      @AsObjectId()
      id!: Types.ObjectId;

      @AsObjectId({each: true})
      ids!: Types.ObjectId[];
    }

    const id = '62fc9b33773277d12d28929b';
    const _id = new Types.ObjectId(id);
    const id2 = '62fc9b33773277d12d28929c';
    const _id2 = new Types.ObjectId(id2);
    const instance = plainToClass(MyClass, {
      id,
      ids: [id, id2],
    });
    expect(instance).toBeInstanceOf(MyClass);
    expect(instance.id).toStrictEqual(_id);
    expect(instance.ids).toStrictEqual([_id, _id2]);
    expect(await validate(instance)).toStrictEqual([]);

    const instance2 = plainToClass(MyClass, {
      id: _id,
      ids: [_id, _id2],
    });
    expect(instance2).toBeInstanceOf(MyClass);
    expect(instance2.id).toStrictEqual(_id);
    expect(instance2.ids).toStrictEqual([_id, _id2]);
    expect(await validate(instance2)).toStrictEqual([]);
  });
});
