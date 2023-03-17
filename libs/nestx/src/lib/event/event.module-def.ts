import {ConfigurableModuleBuilder} from '@nestjs/common';
import {IncomingMessage} from 'http';

export type UserIdProvider = (msg: IncomingMessage) => Promise<string | undefined>;

export interface EventModuleOptions {
  userIdProvider: UserIdProvider;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<EventModuleOptions>().setClassMethodName('forRoot').build();
