import {Inject, Injectable} from '@nestjs/common';
import {ClientNats} from '@nestjs/microservices';
import {OnGatewayConnection, OnGatewayInit, SubscribeMessage, WsResponse} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import {merge, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {EventModuleOptions, MODULE_OPTIONS_TOKEN} from './event.module-def';
import {EventService} from './event.service';

@Injectable()
export class EventGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    @Inject('EVENT_SERVICE') private client: ClientNats,
    @Inject(MODULE_OPTIONS_TOKEN) private options: EventModuleOptions,
    private eventService: EventService,
  ) {
  }

  private unsubscribeRequests = new Subject<{ client: any, event: string }>();

  async afterInit(): Promise<void> {
    await this.client.connect();
  }

  async handleConnection(client: any, message: IncomingMessage): Promise<void> {
    try {
      client.user = await this.options.userIdProvider(message);
    } catch (err) {
      client.send(JSON.stringify(err));
      client.close();
    }
  }

  @SubscribeMessage('subscribe')
  subscribe(client: any, event: string): Observable<WsResponse<unknown>> {
    return merge(this.eventService.subscribe<unknown>(event, client.user)).pipe(
      takeUntil(this.unsubscribeRequests.pipe(filter(unsub => unsub.client === client && unsub.event === event))),
    );
  }

  @SubscribeMessage('unsubscribe')
  unsubscribe(client: any, event: string): void {
    this.unsubscribeRequests.next({client, event});
  }

  @SubscribeMessage('ping')
  ping(client: any, data: string) {
    this.eventService.emit('ping', data, [client.user]);
  }
}
