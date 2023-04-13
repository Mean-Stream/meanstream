/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { EventGateway } from '@clashsoft/nestx';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocketGateway } from '@nestjs/websockets';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useWebSocketAdapter(new WsAdapter(app));
  WebSocketGateway({ path: '/ws/events' })(EventGateway);
  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: 'nats://localhost:4222',
    },
  });
  await app.startAllMicroservices();
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
