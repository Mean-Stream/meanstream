import {ConfigurableModuleBuilder} from '@nestjs/common';

export interface AuthModuleOptions {
  secret: string;
  expiry: string;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<AuthModuleOptions>().setClassMethodName('forRoot').build();
