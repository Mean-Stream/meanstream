import {Inject, Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {KeyObject} from 'node:crypto';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import {UserToken} from './auth.interface';
import {AuthModuleOptions, MODULE_OPTIONS_TOKEN} from './auth.module-def';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: AuthModuleOptions,
  ) {
    let secretOrKey = options.secret || options.publicKey;
    if (secretOrKey instanceof KeyObject) {
      secretOrKey = secretOrKey.export();
    } else if (typeof secretOrKey === 'object' && 'key' in secretOrKey && 'passphrase' in secretOrKey) {
      throw new Error('Secret key+passphrase combination is not currently supported');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: options.verifyOptions?.ignoreExpiration,
      secretOrKey,
      algorithms: options.verifyOptions?.algorithms,
      issuer: options.verifyOptions?.issuer,
      audience: options.verifyOptions?.audience as string | string[],
    } satisfies StrategyOptions);
  }

  async validate(payload: UserToken): Promise<UserToken> {
    return payload;
  }
}
