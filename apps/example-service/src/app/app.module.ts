import {AuthModule, AuthService, EventModule} from '@clashsoft/nestx';
import {Module} from '@nestjs/common';
import {Transport} from '@nestjs/microservices';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModule} from '../user/user.module';


@Module({
  imports: [
    AuthModule.forRoot({
      secret: 'a',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/mean-stream'),
    EventModule.forRootAsync({
      inject: [AuthService],
      useFactory: (service: AuthService) => ({
        transport: Transport.NATS,
        transportOptions: {
          servers: 'nats://localhost:4222',
        },
        userIdProvider: async (msg) => (await service?.parseUserForWebSocket(msg))?.sub,
      }),
    }),
    UserModule,
  ],
})
export class AppModule {
}
