import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROUTE_POLICY_KEY } from '../auth.constants';

@Injectable()
export class RoutePoliceGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('PoliceGuard');
    console.log(context.getHandler());
    console.log(this.reflector.get(ROUTE_POLICY_KEY, context.getHandler()));
    return true;
  }
}
