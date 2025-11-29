import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RecadosService } from 'src/recados/recados.service';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  constructor(private readonly recadosService: RecadosService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-Custom-Header', 'O valor do cabeçalho');

    return next.handle();
  }
}
