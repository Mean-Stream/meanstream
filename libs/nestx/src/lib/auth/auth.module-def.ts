import {ConfigurableModuleBuilder} from '@nestjs/common';
import {JwtModuleOptions} from '@nestjs/jwt';

export type AuthModuleOptions = JwtModuleOptions

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<AuthModuleOptions>()
  .setClassMethodName('forRoot')
  .setExtras({}, def => ({...def, global: true}))
  .build();
