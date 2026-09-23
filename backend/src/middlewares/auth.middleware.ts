import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types/enums';
import { AuthenticatedUser } from '../types/interfaces';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const role = (req.header('x-demo-role') as UserRole | undefined) || UserRole.Admin;
    req.user = {
      id: Number(req.header('x-demo-user-id') || 1),
      name: req.header('x-demo-user-name') || '系统管理员',
      role
    };
    next();
  }
}
