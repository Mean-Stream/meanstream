import {objectIdToBase64, objectId} from './objectid.helper';
import {Types} from "mongoose";

describe('ObjectIdHelper', () => {
  const exampleIdStr = '1234567890abcdef12345678';
  const exampleId = new Types.ObjectId(exampleIdStr);
  const exampleArr = exampleId.id;
  const exampleB64 = exampleId.toString('base64');

  it('should convert hex string to ObjectId', () => {
    expect(objectId(exampleIdStr)).toEqual(exampleId);
  });

  it('should convert byte array to ObjectId', () => {
    expect(objectId(exampleArr)).toEqual(exampleId);
  });

  it('should convert base64 to ObjectId', () => {
    expect(objectId(exampleB64)).toEqual(exampleId);
  });

  it('should keep ObjectId as ObjectId', () => {
    expect(objectId(exampleId)).toEqual(exampleId);
  });

  it('should parse url-safe base64', () => {
    expect(objectId('EjRWeJCrze8SNFZ4')).toEqual(exampleId);
    expect(objectId('_ty6CYdlQyH-3LoJ')).toEqual(new Types.ObjectId('fedcba0987654321fedcba09'));
  });

  it('should generate url-safe base64', () => {
    expect(objectIdToBase64(exampleId)).toEqual('EjRWeJCrze8SNFZ4');
    expect(objectIdToBase64(new Types.ObjectId('fedcba0987654321fedcba09'))).toEqual('_ty6CYdlQyH-3LoJ');
  });
});
