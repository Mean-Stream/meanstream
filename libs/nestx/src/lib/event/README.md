# Events

The events library provides a simple event gateway for NestJS apps based on NATS.

## Setup

```ts
import {EventModule, EventService, initEventGateway} from '@mean-stream/nestx';
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

If you did everything right (including `initEventGateway`!), you will see the output:

```
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "subscribe" message +5ms
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "unsubscribe" message +0ms
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
It ensures the `create`, `update`, `delete`, `upsertRaw`, `updateMany` and `deleteMany` methods emit appropriate events by calling the service's `emit` method.

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
