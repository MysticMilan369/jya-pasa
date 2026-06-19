import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { ResponseDto } from '../dto/response.dto';

interface PaginatedResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

function isPaginatedResponse<T>(value: unknown): value is PaginatedResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseDto<unknown>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseDto<unknown>> {
    return next.handle().pipe(
      map((response: unknown): ResponseDto<unknown> => {
        if (isPaginatedResponse(response)) {
          return new ResponseDto({
            success: true,
            message: 'Success',
            data: response.data,
            meta: response.meta,
          });
        }

        return new ResponseDto({
          success: true,
          message: 'Success',
          data: response,
        });
      }),
    );
  }
}
