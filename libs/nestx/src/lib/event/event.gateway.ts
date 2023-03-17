import {Inject} from '@nestjs/common';
import {ClientNats} from '@nestjs/microservices';
import {Client} from '@nestjs/microservices/external/nats-client.interface';
import {OnGatewayConnection, OnGatewayInit, SubscribeMessage, WsResponse} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import {merge, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {USER_ID_PROVIDER} from './index';

export type UserIdProvider = (msg: IncomingMessage) => Promise<string | undefined>;

export class EventGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    @Inject('EVENT_SERVICE') private client: ClientNats,
    @Inject(USER_ID_PROVIDER) private userIdProvider: UserIdProvider,
  ) {
  }

  private unsubscribeRequests = new Subject<{ client: any, event: string }>();

  async afterInit(): Promise<void> {
    await this.client.connect();
  }

  async handleConnection(client: any, message: IncomingMessage): Promise<void> {
    try {
      client.user = await this.userIdProvider(message);
    } catch (err) {
      client.send(JSON.stringify(err));
      client.close();
    }
  }

  @SubscribeMessage('subscribe')
  subscribe(client: any, event: string): Observable<WsResponse<unknown>> {
    return merge(this.observe(client, event)).pipe(
      takeUntil(this.unsubscribeRequests.pipe(filter(unsub => unsub.client === client && unsub.event === event))),
    );
  }

  private observe<T>(client: any, event: string): Observable<WsResponse<T>> {
    return new Observable<WsResponse<T>>(observer => {
      const nats = ((this.client as any).natsClient) as Client;
      const subscription = nats.subscribe(event, {
        callback: (err, msg) => {
          const event = msg.subject;
          const dataStr = Buffer.from(msg.data).toString('utf-8');
          let parsed: any;
          try {
            parsed = JSON.parse(dataStr);
          } catch (err) {
            console.error('Invalid message:', dataStr, err);
            return;
          }
          const {data: {data, users}} = parsed;
          if (users && (!client.user || !users.includes(client.user))) {
            return;
          }
          observer.next({
            event,
            data,
          });
        },
      });
      return () => subscription.unsubscribe();
    });
  }

  @SubscribeMessage('unsubscribe')
  unsubscribe(client: any, event: string): void {
    this.unsubscribeRequests.next({client, event});
  }
}
