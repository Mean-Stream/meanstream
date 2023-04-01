import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {WsException} from '@nestjs/websockets';
import {IncomingMessage} from 'http';
import {UserToken} from './auth.interface';
import {JwtStrategy} from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
  ) {
  }

  async parseUserForWebSocket(message: IncomingMessage): Promise<UserToken | undefined> {
    const token = this.getToken(message);
    if (!token) {
      throw new WsException('Not authorized');
    }

    try {
      const parsedToken = this.jwtService.verify(token);
      return await this.jwtStrategy.validate(parsedToken);
    } catch (error: any) {
      throw new WsException(error);
    }
  }

  getToken(message: IncomingMessage): string | undefined {
    const authHeader = message.headers.authorization;
    if (authHeader) {
      const headerToken = authHeader.startsWith('Bearer ') ? authHeader.substring('Bearer '.length) : undefined;
      if (headerToken) {
        return headerToken;
      }
    }
    if (!message.url) {
      return undefined;
    }
    const url = new URL(message.url, 'http://localhost');
    const queryToken = url.searchParams.get('bearer');
    return queryToken ?? undefined;
  }
}
