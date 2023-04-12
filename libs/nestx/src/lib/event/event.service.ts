import {Inject, Injectable, Logger, Optional} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {ClientProxy} from '@nestjs/microservices';
import {Client} from '@nestjs/microservices/external/nats-client.interface';
import {Observable} from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    @Inject('EVENT_SERVICE') private client: ClientProxy,
    private eventEmitter2: EventEmitter2,
    @Optional() @Inject() private logger = new Logger(EventService.name),
  ) {
  }

  emit<T>(event: string, data: T, users?: string[], oldData?: T) {
    this.eventEmitter2.emit(event, data, users, oldData);
    this.client.emit(event, {data, users}).subscribe();
  }

  subscribe<T>(event: string, user?: string): Observable<{ event: string, data: T }> {
    return new Observable(observer => {
      const nats = ((this.client as any).natsClient) as Client;
      const subscription = nats.subscribe(event, {
        callback: (err, msg) => {
          const event = msg.subject;
          const dataStr = Buffer.from(msg.data).toString('utf-8');
          let parsed: { data: { data: T, users?: string[] } };
          try {
            parsed = JSON.parse(dataStr);
          } catch (err: unknown) {
            if (err instanceof Error) {
              this.logger.error(`Invalid message: ${err.message}: ${dataStr}`, err.stack);
            } else {
              this.logger.error(err);
            }
            return;
          }
          const {data: {data, users}} = parsed;
          if (users && (!user || !users.includes(user))) {
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
}
