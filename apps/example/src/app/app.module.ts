import {EventModule} from '@clashsoft/nestx';
import {Module} from '@nestjs/common';
import {Transport} from '@nestjs/microservices';

import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    EventModule.forRootAsync({
      useFactory: () => ({
        transport: Transport.NATS,
        transportOptions: {
          servers: 'nats://localhost:4222',
        },
        userIdProvider: async () => '123',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
