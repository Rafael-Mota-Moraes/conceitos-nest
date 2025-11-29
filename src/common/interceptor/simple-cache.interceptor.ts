import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, of, tap, throwError } from 'rxjs';

export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('Está no cache');
      return of(this.cache.get(url));
    }
    return next.handle().pipe(
      tap((data) => {
        this.cache.set(url, data);
        console.log('Armazenado em cache: ', url);
      }),
    );
  }
}
