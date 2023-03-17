import {EventModule, USER_ID_PROVIDER} from '@clashsoft/nestx';
import {Module} from '@nestjs/common';
import {Transport} from '@nestjs/microservices';

import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    EventModule.register(Transport.NATS, {
      servers: 'nats://localhost:4222',
    }, {
      provide: USER_ID_PROVIDER,
      useValue: async () => '123',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
