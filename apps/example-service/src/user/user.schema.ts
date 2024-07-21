import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {SchemaTypes, Types} from 'mongoose';

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({type: SchemaTypes.UUID})
  uuid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
