# Resources

## Usage

The `MongooseRepository` can be inherited from a service to provide many useful default CRUD methods.

```ts
import {MongooseRepository} from "@mean-stream/nestx";
import {UserService} from "./user.service";

class UserService extends MongooseRepository<User> {
  constructor(
    @InjectModel(User.name) model,
  ) {
    super(model);
  }
}

class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  examples() {
    this.userService.create({name: 'Alice'});
    this.userService.findOne(id);
    this.userService.findAll({...filter});
    this.userService.update(id, {...update});
    this.userService.upsert({...filter}, {...update});
    this.userService.updateMany({...filter}, {...update});
    this.userService.delete(id);
    this.userService.deleteMany({...filter});
  }
}
```
