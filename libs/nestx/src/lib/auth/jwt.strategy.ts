import {Inject, Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import {UserToken} from './auth.interface';
import {AuthModuleOptions, MODULE_OPTIONS_TOKEN} from './auth.module-def';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: AuthModuleOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: options.verifyOptions?.ignoreExpiration,
      secretOrKey: options.secret || options.publicKey,
      algorithms: options.verifyOptions?.algorithms,
      issuer: options.verifyOptions?.issuer,
      audience: options.verifyOptions?.audience as string | string[],
    } satisfies StrategyOptions);
  }

  async validate(payload: UserToken): Promise<UserToken> {
    return payload;
  }
}
