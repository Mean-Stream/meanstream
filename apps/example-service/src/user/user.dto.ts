import {PartialType} from '@nestjs/swagger';
import {User} from "./user.schema";

export class CreateUserDto extends User {
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
