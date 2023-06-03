import {Injectable} from '@nestjs/common';
import {MongooseRepository} from "@clashsoft/nestx";
import {User} from "./user.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class UserService extends MongooseRepository<User> {
  constructor(
    @InjectModel(User.name) model,
  ) {
    super(model);
  }
}
