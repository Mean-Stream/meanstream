import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
