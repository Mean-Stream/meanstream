# Events

The events library provides a simple event gateway for NestJS apps based on NATS.
Usage:

```ts
import {EventModule, EventService, initEventGateway} from '@clashsoft/nestx';
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
