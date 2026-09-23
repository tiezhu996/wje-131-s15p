import { CanActivate, ExecutionContext, ForbiddenException, Injectable, mixin, Type } from '@nestjs/common';
import { UserRole } from '../types/enums';

export function rbacMiddleware(roles: UserRole[]): Type<CanActivate> {
  @Injectable()
  class RbacGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user || !roles.includes(user.role)) {
        throw new ForbiddenException('当前角色无权执行此操作');
      }
      return true;
    }
  }

  return mixin(RbacGuard);
}
