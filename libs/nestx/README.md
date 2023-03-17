# nestx

nestx is an extension package for NestJS apps.

## Libraries

### Events

The events library provides a simple event gateway for NestJS apps based on NATS.
Usage:

```ts
import {EventModule, EventService, initEventGateway} from '@clashsoft/nestx';
import {IncomingMessage} from 'http';
import {USER_ID_PROVIDER} from './index';

// main.ts:
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ...
  initEventGateway(port, path);
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
  ],
  providers: [
    
  ]
})
class AppModule {
}

// Any Service:
class MyService {
  constructor(private readonly eventService: EventService) {
  }

  emit() {
    this.eventService.emit('some.event', myPayload, relevantUsers);
  }
}
```

If you did everything right (including `initEventGateway`!), you will see the output:

```
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "subscribe" message +5ms
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "unsubscribe" message +0ms
```

### NotFound

The `@NotFound` decorator automatically decorates an endpoint with `@ApiNotFoundResponse` with `@nestjs/swagger` is available.
It converts return values `null` and `undefined` to a `404 Not Found` error.
In addition, the `notFound` function can be used like this:

```ts
const something = await findOne(id) ?? notFound(id);
```

If `findOne` returns `Something | null`, the type of `something` will be inferred as `Something`.

## Development

### Building

Run `nx build nestx` to build the library.

### Running unit tests

Run `nx test nestx` to execute the unit tests via [Jest](https://jestjs.io).
