import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { rbacMiddleware } from '../middlewares/rbac.middleware';
import { UserRole } from '../types/enums';
import { ok } from '../utils/response';
import { TaskPhaseService } from '../services/taskPhase.service';

@Controller('api/task-phases')
export class TaskPhaseController {
  constructor(private readonly taskPhaseService: TaskPhaseService) {}

  @Get('project/:projectId')
  async listByProject(@Param('projectId') projectId: string) {
    return ok(await this.taskPhaseService.findByProject(Number(projectId)));
  }

  @Post()
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async create(@Body() body: Record<string, unknown>, @Req() req: Request) {
    return ok(await this.taskPhaseService.create(body, req.user?.id), '阶段已创建');
  }

  @Patch(':id/progress')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async updateProgress(@Param('id') id: string, @Body() body: { percentComplete: number }, @Req() req: Request) {
    return ok(await this.taskPhaseService.updateProgress(Number(id), body.percentComplete, req.user?.id), '阶段进度已更新');
  }

  @Patch(':id/block')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async block(@Param('id') id: string, @Req() req: Request) {
    return ok(await this.taskPhaseService.setBlocked(Number(id), true, req.user?.id), '阶段已阻塞');
  }

  @Patch(':id/unblock')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async unblock(@Param('id') id: string, @Req() req: Request) {
    return ok(await this.taskPhaseService.setBlocked(Number(id), false, req.user?.id), '阶段已解除阻塞');
  }
}
