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
    // create
    this.userService.create({name: 'Alice'});
    this.userService.createMany([{name: 'Alice'}, {name: 'Bob'}]);

    // read
    this.userService.count({...filter});
    this.userService.exists({...filter});
    this.userService.distinct('field', {...filter});
    this.userService.find(id);
    this.userService.findOne({...filter});
    this.userService.findAll({...filter});

    // update
    this.userService.update(id, {...update});
    this.userService.updateOne({...filter}, {...update});
    this.userService.updateMany({...filter}, {...update});
    this.userService.upsert({...filter}, {...update});

    // delete
    this.userService.delete(id);
    this.userService.deleteOne({...filter});
    this.userService.deleteMany({...filter});

    // specific to MongooseRepository
    this.userService.saveAll([...docs]);
    this.userService.deleteAll([...docs]);
  }
}
```
