import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { rbacMiddleware } from '../middlewares/rbac.middleware';
import { ProjectStatus, UserRole } from '../types/enums';
import { ok } from '../utils/response';
import { ProjectService } from '../services/project.service';

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list() {
    return ok(await this.projectService.findAll());
  }

  @Get('dashboard/summary')
  async dashboard() {
    return ok(await this.projectService.dashboard());
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ok(await this.projectService.findOne(Number(id)));
  }

  @Post()
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager]))
  async create(@Body() body: Record<string, unknown>, @Req() req: Request) {
    return ok(await this.projectService.create(body, req.user?.id), '项目已创建');
  }

  @Patch(':id/progress')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async updateProgress(
    @Param('id') id: string,
    @Body() body: { progress: number; status?: ProjectStatus },
    @Req() req: Request
  ) {
    return ok(await this.projectService.updateProgress(Number(id), body.progress, body.status, req.user?.id), '项目进度已更新');
  }

  @Patch(':id/archive')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager]))
  async archive(@Param('id') id: string, @Req() req: Request) {
    return ok(await this.projectService.archive(Number(id), req.user?.id), '项目已归档');
  }
}
