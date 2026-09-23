import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { rbacMiddleware } from '../middlewares/rbac.middleware';
import { TaskStatus, UserRole } from '../types/enums';
import { ok } from '../utils/response';
import { SubTaskService } from '../services/subTask.service';

@Controller('api/sub-tasks')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Get('phase/:phaseId')
  async listByPhase(@Param('phaseId') phaseId: string) {
    return ok(await this.subTaskService.findByPhase(Number(phaseId)));
  }

  @Get('reports/timesheet')
  async timesheet() {
    return ok(await this.subTaskService.timesheet());
  }

  @Post()
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async create(@Body() body: Record<string, unknown>, @Req() req: Request) {
    return ok(await this.subTaskService.create(body, req.user?.id), '子任务已创建');
  }

  @Patch(':id/status')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman, UserRole.Worker]))
  async updateStatus(@Param('id') id: string, @Body() body: { status: TaskStatus }, @Req() req: Request) {
    return ok(await this.subTaskService.updateStatus(Number(id), body.status, req.user?.id), '子任务状态已更新');
  }
}
