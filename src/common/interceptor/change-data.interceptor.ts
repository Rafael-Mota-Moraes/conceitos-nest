import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, of, tap, throwError } from 'rxjs';

export class ChangeDataInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return {
            data,
            count: data.length,
          };
        }
        return data;
      }),
    );
  }
}
