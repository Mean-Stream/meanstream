import {Module} from '@nestjs/common';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {EventGateway} from './event.gateway';
import {ConfigurableModuleClass} from './event.module-def';
import {EventService} from './event.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: 'nats://localhost:4222',
        },
      },
    ]),
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
  ],
  providers: [
    EventService,
    EventGateway,
  ],
  exports: [EventService],
})
export class EventModule extends ConfigurableModuleClass {
}
