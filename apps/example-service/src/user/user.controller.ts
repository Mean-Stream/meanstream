import {Body, Controller, Delete, Get, MessageEvent, Param, Patch, Post, Sse,} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {EventService, ObjectIdPipe} from "@clashsoft/nestx";
import {Types} from "mongoose";
import {map, Observable} from "rxjs";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) {
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.eventService.subscribe('users.*.*').pipe(map(({event, data}) => ({data: {event, data}})));
  }

  @Sse(':id/events')
  eventsId(@Param('id', ObjectIdPipe) id: Types.ObjectId): Observable<MessageEvent> {
    return this.eventService.subscribe(`users.${id}.*`).pipe(map(({event, data}) => ({data: {event, data}})));
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
