import {applyDecorators, UseInterceptors} from '@nestjs/common';
import {optionalRequire} from '@nestjs/core/helpers/optional-require';
import {NotFoundInterceptor} from './not-found.interceptor';

export function NotFound(description = 'Not found') {
  const apiNotFound = optionalRequire('@nestjs/swagger').ApiNotFoundResponse;
  return applyDecorators(
    UseInterceptors(NotFoundInterceptor),
    ...(apiNotFound ? [apiNotFound({description})] : []),
  );
}
