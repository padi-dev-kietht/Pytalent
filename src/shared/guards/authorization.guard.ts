import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from '@enum/role.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly roles: Array<RoleEnum>) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let flag = false;
    this.roles.forEach((role) => {
      if (user.role === role) {
        flag = true;
      }
    });
    return flag;
  }
}
