# Events

The events library provides a simple event gateway for NestJS apps based on NATS.

## Setup

```ts
import {EventModule, EventService} from '@mean-stream/nestx';
import {WebSocketGateway} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import {EventGateway} from './event.gateway';
import {USER_ID_PROVIDER} from './index';

// main.ts:
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ...
  WebSocketGateway({path})(EventGateway);
  app.connectMicroservice({
    transport: Transport.NATS,
    options: natsOptions,
  });
  // ...
  app.startAllMicroservices();
  app.listen(port);
}

// AppModule:
@Module({
  imports: [
    EventModule.register(Transport.NATS, natsOptions, {
      provide: USER_ID_PROVIDER,
      useValue: async msg => 'id',
    }),
  ]
})
class AppModule {
}
```

If you did everything right (including the call to `WebSocketGateway`), you will see the output:

```
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "subscribe" message +5ms
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "unsubscribe" message +0ms
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "ping" message +0ms
```

## Usage

### EventService

You can inject and use the EventService in any other service.

```ts
class MyService {
  constructor(private readonly eventService: EventService) {
  }

  emit() {
    this.eventService.emit('some.event', myPayload, relevantUsers);
  }
}
```

### EventRepository

The `@EventRepository` decorator seemlessly integrates with [`Repository`](../resource/README.md).
It ensures the following methods emit appropriate events by calling the service's `emit` method.

- `create`
- `update`
- `updateOne`
- `delete`
- `deleteOne`
- `upsertRaw` - Note that `upsert` itself is not wrapped, assuming it is implemented using `upsertRaw`.
- `updateMany` - Note that the operation itself does not return the documents, so an additional `findAll` is done after the update operation.
  This may yield slightly different results if the update affects which documents match the filter.
- `deleteMany` - Note that the operation itself does not return the documents, so an additional `findAll` is done before the delete operation.
- `save` and `saveAll` (MongooseRepository)
- `deleteAll` (MongooseRepository)

```ts
import {MongooseRepository, EventRepository} from "@mean-stream/nestx";

@EventRepository()
class UserService extends MongooseRepository<User> {
  constructor(
    private readonly eventService: EventService,
    @InjectModel(User.name) model,
  ) {
    super(model);
  }

  emit(event: string, user: User) {
    this.eventService.emit(`users.${user._id}.${event}`, user);
  }
}
```

### Emit

Use the `@Emit` decorator to emit custom events.

```ts
class MyService {
  @Emit('myEvent')
  async myMethod(): Promise<string> {
    return 'myData';
  }

  emit(event: string, data: any) {
    console.log(event, data); // logs "myEvent myData"
  }
}
```

### Bypassing Events

If you want to perform an update operation without sending events, call the `MongooseRepository` prototype method directly:

```ts
import {MongooseRepository} from '@mean-stream/nestx';

MongooseRepository.prototype.updateMany.call(userService, {...filter}, {...update});
```

## ValidatedEvent

The `@ValidatedEvent` decorator can be used to validate parameters for event handlers using class-validator.
Note that the decorated method must be `async`, or the decorator will create a warning and wrap all results into a Promise.

```ts
class MyEvent {
  @IsString()
  readonly myProperty: string;
}

class MyHandler {
  @ValidatedEvent({transform: true})
  @OnEvent('my.event')
  async handle(event: MyEvent) {
    console.log(event instanceof MyEvent); // true
  }

  async example() {
    this.handle('my.event', {myProperty: "abc"});

    try {
      await this.handle('my.event', {myProperty: 123});
    } catch (e) {
      console.log(e.message); // "myProperty must be a string"
    }
  }
}
```
