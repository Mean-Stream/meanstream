import {DynamicModule} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {EventGateway} from './event.gateway';
import {EventService} from './event.service';

export class EventModule {
  static register(
    transport: Transport,
    transportOptions: any,
  ): DynamicModule {
    return {
      module: EventModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name: 'EVENT_SERVICE',
            transport: transport,
            options: transportOptions,
          },
        ]),
      ],
      providers: [EventService, EventGateway],
      exports: [EventService],
    };
  }
}
