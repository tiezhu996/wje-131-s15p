import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialUsage } from '../models/materialUsage.entity';
import { Project } from '../models/project.entity';
import { ProjectStatus } from '../types/enums';
import { AuditService } from './audit.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(MaterialUsage) private readonly usageRepository: Repository<MaterialUsage>,
    private readonly auditService: AuditService
  ) {}

  async findAll() {
    return this.projectRepository.find({ relations: ['phases', 'materialUsages'], order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['phases', 'phases.subTasks', 'materialUsages']
    });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }
    return project;
  }

  async create(payload: Partial<Project>, actorId = 1) {
    const project = await this.projectRepository.save(this.projectRepository.create(payload));
    await this.auditService.record('project.create', 'Project', project.id, actorId, payload);
    return project;
  }

  async updateProgress(id: number, progress: number, status?: ProjectStatus, actorId = 1) {
    const project = await this.findOne(id);
    project.progress = progress;
    if (status) {
      project.status = status;
    }
    const updated = await this.projectRepository.save(project);
    await this.auditService.record('project.progress.update', 'Project', id, actorId, { progress, status });
    return updated;
  }

  async archive(id: number, actorId = 1) {
    const project = await this.findOne(id);
    project.status = ProjectStatus.Archived;
    const updated = await this.projectRepository.save(project);
    await this.auditService.record('project.archive', 'Project', id, actorId);
    return updated;
  }

  async dashboard() {
    const projects = await this.findAll();
    const usages = await this.usageRepository.find({ relations: ['material'] });
    const materialUsageTop = Object.values(
      usages.reduce<Record<string, { materialName: string; quantity: number; unit: string }>>((acc, usage) => {
        const key = usage.material.name;
        acc[key] ||= { materialName: usage.material.name, quantity: 0, unit: usage.material.unit };
        acc[key].quantity += Number(usage.quantity);
        return acc;
      }, {})
    )
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return {
      activeProjects: projects.filter((project) => project.status === ProjectStatus.InProgress).length,
      delayedProjects: projects.filter((project) => project.status === ProjectStatus.Delayed).length,
      averageProgress: projects.length
        ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
        : 0,
      materialUsageTop
    };
  }
}
