# Ref

The `@Ref` decorator automatically decorates a property that is an ObjectID references.

```ts
import {Ref, OptionalRef, RefArray} from '@mean-stream/nestx';
import {Types} from 'mongoose';

class Group {
  _id: Types.ObjectId;
  createdAt: Date;

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
The transformer support both 24-character hex strings and 16-character base64 strings.

## ObjectId Pipes

In addition, this module offers the following pipes:

```ts
ObjectIdPipe // converts strings and numbers to ObjectIDs and retains others
OptionalObjectIdPipe // retains null and undefined and acts like ObjectIdPipe otherwise
ObjectIdArrayPipe // converts each element of an array like ObjectIdPipe
```

The pipes support both 24-character hex strings and 16-character base64 strings.

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

To enable 16-character base64 IDs, you can modify the schema like this:

```ts
@Schema({
  id: false, // without this, the getter below will be overriden
  toJSON: {virtuals: true}, // to include only id, use "virtuals: ['id']"
  toObject: {virtuals: true}, // see above
  virtuals: {
    id: { // can be named "shortId" or whatever else. The "id: false" above is not necessary in that case.
      get: function (this: Group) {
        return this._id.toString('base64');
      },
    },
  },
})
```

Your JSON results will then look like this:

```json5
{
  "_id": "645ca44113a3287b2fa39705", // long id
  "id": "ZFykQROjKHsvo5cF", // short id
  "...": "..."
}
```

## DTOs

The `DTO<T>` helper type can be used for frontend code to automatically derive types that use `string` instead of `ObjectId` or `Date`:

```ts
type GroupDTO = DTO<Group>; // using Group from the example above
// same as:
interface GroupDTO {
  _id: string;
  createdAt: string;
  createdBy: string;
  updatedBy?: string;
  members: string[];
  admins?: string[];
}
```

In addition, the `Doc` type can help in the backend:

```ts
type GroupDoc = Doc<Group>;
// same as:
type GroupDoc = Group & Document<Types.ObjectId, object, Group>;
```

The optional second and third parameters of `Doc` specify the ID type and the helpers type of `Document<ID, HELP, T>`, respectively.
