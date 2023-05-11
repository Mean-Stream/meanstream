import {objectId} from './objectid.helper';
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
});
