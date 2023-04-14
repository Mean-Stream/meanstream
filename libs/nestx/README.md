# nestx

[![NPM version](https://badge.fury.io/js/@mean-stream%2Fnestx.svg)](https://www.npmjs.com/package/@mean-stream/nestx)

nestx is an extension package for NestJS apps.

## Installation

```
$ npm install @mean-stream/nestx
```

## Usage

### Events

The events library provides a simple event gateway for NestJS apps based on NATS.
Usage:

```ts
import {EventModule, EventService, initEventGateway} from '@clashsoft/nestx';
import {WebSocketGateway} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import {EventGateway} from './event.gateway';
import {USER_ID_PROVIDER} from './index';

// main.ts:
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ...
  WebSocketGateway({path})(EventGateway);
  app.connectMicroservice({
    transport: Transport.NATS,
    options: natsOptions,
  });
  // ...
  app.startAllMicroservices();
  app.listen(port);
}

// AppModule:
@Module({
  imports: [
    EventModule.register(Transport.NATS, natsOptions, {
      provide: USER_ID_PROVIDER,
      useValue: async msg => 'id',
    }),
  ]
})
class AppModule {
}

// Any Service:
class MyService {
  constructor(private readonly eventService: EventService) {
  }

  emit() {
    this.eventService.emit('some.event', myPayload, relevantUsers);
  }
}
```

If you did everything right (including `initEventGateway`!), you will see the output:

```
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "subscribe" message +5ms
[Nest] 27843  - 03/17/2023, 10:56:29 AM     LOG [WebSocketsController] EventGateway subscribed to the "unsubscribe" message +0ms
```

### Ref

The `@Ref` decorator automatically decorates a property that is an ObjectID references.

```ts
import {Ref, OptionalRef, RefArray} from '@mean-stream/nestx';
import {Types} from 'mongoose';

class Group {
  @Ref(User.name)
  createdBy: Types.ObjectId;

  @OptionalRef(User.name) // or @Ref(User.name, {optional: true})
  updatedBy?: Types.ObjectId;

  @RefArray(User.name) // or @Ref(User.name, {array: true})
  members: Types.ObjectId[];

  @Ref(User.name, {optional: true, array: true})
  admins?: Types.ObjectId[];
}
```

An example usage using `populate`:

```ts
const groupWithMembers = await this.model.findOneById(groupId).populate<{members: User[]}>('members').exec();
groupWithMembers.members.map(user => user.name);
```

It adds the following decorators:

```ts
@Transform(({value}) => objectId(value)) // from class-transformer, converts strings and numbers to ObjectIDs and retains others
@IsInstance(Types.ObjectId) // from class-validator, validates ObjectIDs and rejects other values
@Prop({type: Types.ObjectId, ref, required: true}) // if @nestjs/mongoose is available
@ApiProperty({example: EXAMPLE_OBJECT_ID, format: 'objectid'}) // if @nestjs/swagger is available
```

The `@RefArray` and `@OptionalRef` decorators are also available and use the equivalent decorators but with support for optionals and arrays.

### NotFound

The `@NotFound` decorator automatically decorates an endpoint with `@ApiNotFoundResponse` with `@nestjs/swagger` is available.
It converts return values `null` and `undefined` to a `404 Not Found` error.
In addition, the `notFound` function can be used like this:

```ts
const something = await findOne(id) ?? notFound(id);
```

If `findOne` returns `Something | null`, the type of `something` will be inferred as `Something`.

## Development

### Building

Run `nx build nestx` to build the library.

### Running unit tests

Run `nx test nestx` to execute the unit tests via [Jest](https://jestjs.io).
