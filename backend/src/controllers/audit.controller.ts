import { Controller, Get, UseGuards } from '@nestjs/common';
import { rbacMiddleware } from '../middlewares/rbac.middleware';
import { UserRole } from '../types/enums';
import { ok } from '../utils/response';
import { AuditService } from '../services/audit.service';

@Controller('api/audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager]))
  async list() {
    return ok(await this.auditService.list());
  }
}
