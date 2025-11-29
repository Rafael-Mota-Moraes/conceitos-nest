import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RecadosService } from 'src/recados/recados.service';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  constructor(private readonly recadosService: RecadosService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    if (token != '123') {
      throw new UnauthorizedException('Token inválido');
    }
    console.log(token);
    return next.handle();
  }
}
