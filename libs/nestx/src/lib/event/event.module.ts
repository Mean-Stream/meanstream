import {Module} from '@nestjs/common';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {ClientProxyFactory} from '@nestjs/microservices';
import {EventGateway} from './event.gateway';
import {ConfigurableModuleClass, EventModuleOptions, MODULE_OPTIONS_TOKEN} from './event.module-def';
import {EventService} from './event.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
  ],
  providers: [
    EventService,
    EventGateway,
    {
      provide: 'EVENT_SERVICE',
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: EventModuleOptions) => ClientProxyFactory.create({
        transport: options.transport,
        options: options.transportOptions,
      }),
    },
  ],
  exports: [EventService],
})
export class EventModule extends ConfigurableModuleClass {
}
