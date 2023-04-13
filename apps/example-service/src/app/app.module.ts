import { EventModule } from '@clashsoft/nestx';
import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    EventModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (service: AuthService) => ({
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
export class AppModule {}