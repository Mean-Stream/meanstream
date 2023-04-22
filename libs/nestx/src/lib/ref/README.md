# Ref

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

## Populate

An example usage using `populate`:

```ts
const groupWithMembers = await this.model.findOneById(groupId).populate<{members: User[]}>('members').exec();
groupWithMembers.members.map(user => user.name);
```

## Decorator Details

It adds the following decorators:

```ts
@Transform(({value}) => objectId(value)) // from class-transformer, converts strings and numbers to ObjectIDs and retains others
@IsInstance(Types.ObjectId) // from class-validator, validates ObjectIDs and rejects other values
@Prop({type: Types.ObjectId, ref, required: true}) // if @nestjs/mongoose is available
@ApiProperty({example: EXAMPLE_OBJECT_ID, format: 'objectid'}) // if @nestjs/swagger is available
```

The `@RefArray` and `@OptionalRef` decorators are also available and use the equivalent decorators but with support for optionals and arrays.

## ObjectId Pipes

In addition, this module offers the following pipes:

```ts
ObjectIdPipe // converts strings and numbers to ObjectIDs and retains others
OptionalObjectIdPipe // retains null and undefined and acts like ObjectIdPipe otherwise
ObjectIdArrayPipe // converts each element of an array like ObjectIdPipe
```

Example:

```ts
class GroupController {
  @Get(':id')
  findOne(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
  ) {
    // ...
  }
 
  @Get()
  findAll(
    @Query('members', ParseArrayPipe, ObjectIdArrayPipe) members: Types.ObjectId[],
    @Query('createdBy', OptionalObjectIdPipe) createdBy?: Types.ObjectId,
  ) {
    // ...
  }
}
```