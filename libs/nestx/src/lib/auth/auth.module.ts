import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthModuleOptions, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN} from './auth.module-def';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AuthModule],
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: async (options: AuthModuleOptions) => ({
        secret: options.secret,
        verifyOptions: {},
        signOptions: {
          expiresIn: options.expiry,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule extends ConfigurableModuleClass {
}
