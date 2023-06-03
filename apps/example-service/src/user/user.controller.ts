import {Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {ObjectIdPipe} from "@clashsoft/nestx";
import {Types} from "mongoose";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdPipe) id: Types.ObjectId) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ObjectIdPipe) id: Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', ObjectIdPipe) id: Types.ObjectId) {
    return this.userService.delete(id);
  }
}
