import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../utils/logger';

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        Logger.info('audit.log', {
          action: req.method,
          resource: req.originalUrl,
          actorId: req.user?.id,
          statusCode: res.statusCode
        });
      }
    });
    next();
  }
}
