import {Global, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthModuleOptions, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN} from './auth.module-def';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AuthModuleOptions) => options,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, JwtStrategy, MODULE_OPTIONS_TOKEN],
})
export class AuthModule extends ConfigurableModuleClass {
}
