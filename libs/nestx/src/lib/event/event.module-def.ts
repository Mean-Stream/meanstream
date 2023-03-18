import {ConfigurableModuleBuilder} from '@nestjs/common';
import {Transport} from '@nestjs/microservices';
import {IncomingMessage} from 'http';

export type UserIdProvider = (msg: IncomingMessage) => Promise<string | undefined>;

export interface EventModuleOptions {
  userIdProvider: UserIdProvider;
  transport: Transport;
  transportOptions: any;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<EventModuleOptions>().setClassMethodName('forRoot').build();
