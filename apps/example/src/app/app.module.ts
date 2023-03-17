import {EventModule} from '@clashsoft/nestx';
import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    EventModule.forRootAsync({
      useFactory: () => ({
        userIdProvider: async () => undefined,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
