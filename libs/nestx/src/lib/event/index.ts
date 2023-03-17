import {WebSocketGateway} from '@nestjs/websockets';
import {EventGateway} from './event.gateway';

export * from './event.gateway';
export * from './event.service';
export * from './event.module';

export const USER_ID_PROVIDER = Symbol('User ID Provider');

export function initEventGateway(path: string, port?: number) {
  WebSocketGateway(port, {path})(EventGateway);
}
