import {Injectable} from '@nestjs/common';
import {EventService, MongooseRepository} from "@clashsoft/nestx";
import {User} from "./user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {EventRepository} from "@clashsoft/nestx";

@Injectable()
@EventRepository()
export class UserService extends MongooseRepository<User> {
  constructor(
    @InjectModel(User.name) model,
    private eventService: EventService,
  ) {
    super(model);
  }

  emit(event: string, data: User) {
    this.eventService.emit(`users.${data._id}.${event}`, data);
  }
}
