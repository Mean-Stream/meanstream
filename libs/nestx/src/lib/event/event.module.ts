import {DynamicModule, Provider} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {EventGateway, UserIdProvider} from './event.gateway';
import {EventService} from './event.service';

export class EventModule {
  static register(
    transport: Transport,
    transportOptions: any,
    userIdProvider: Provider<UserIdProvider>,
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
      providers: [EventService, EventGateway, userIdProvider],
      exports: [EventService],
    };
  }
}
