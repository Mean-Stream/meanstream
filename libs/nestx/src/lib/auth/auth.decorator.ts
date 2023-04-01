import {applyDecorators, createParamDecorator, ExecutionContext, UseGuards} from '@nestjs/common';
import {optionalRequire} from '@nestjs/core/helpers/optional-require';
import {AuthGuard} from '@nestjs/passport';

export const DEFAULT_DESCRIPTION = 'Missing or invalid Bearer token.';

export function Auth(description = DEFAULT_DESCRIPTION) {
  const swagger = optionalRequire('@nestjs/swagger');
  const useGuards = UseGuards(AuthGuard('jwt'));
  return swagger ? applyDecorators(
    useGuards,
    swagger.ApiBearerAuth(),
    swagger.ApiUnauthorizedResponse({description}),
  ) : useGuards;
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
