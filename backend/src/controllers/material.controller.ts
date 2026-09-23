import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { rbacMiddleware } from '../middlewares/rbac.middleware';
import { UserRole } from '../types/enums';
import { ok } from '../utils/response';
import { MaterialService } from '../services/material.service';

@Controller('api/materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  async list() {
    return ok(await this.materialService.findAll());
  }

  @Get('usage')
  async usage(@Query('projectId') projectId?: string, @Query('phaseId') phaseId?: string) {
    return ok(await this.materialService.usage(projectId ? Number(projectId) : undefined, phaseId ? Number(phaseId) : undefined));
  }

  @Patch(':id/receive')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async receive(@Param('id') id: string, @Body() body: { quantity: number }, @Req() req: Request) {
    return ok(await this.materialService.receive(Number(id), body.quantity, req.user?.id), '材料已入库');
  }

  @Post('usage')
  @UseGuards(rbacMiddleware([UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]))
  async issue(@Body() body: Record<string, unknown>, @Req() req: Request) {
    return ok(await this.materialService.issue(body, req.user?.id), '材料已出库');
  }
}
