import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
