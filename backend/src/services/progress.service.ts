import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../models/project.entity';
import type { SubTask } from '../models/subTask.entity';
import { TaskPhase } from '../models/taskPhase.entity';
import { PhaseStatus } from '../types/enums';
import { AuditService } from './audit.service';
import { phasePercentFromTasks, projectProgressFromPhases } from './progress-calculation';

/**
 * 子任务状态变更后的进度联动：
 * - 有子任务的阶段：按已完成子任务预计工时占全部子任务预计工时的比例重算阶段进度，
 *   全部完成时阶段标记为已完成；已完成任务退回后，进度与状态相应回落；
 * - 没有子任务的阶段：保留原有进度（含人工维护值）；
 * - 项目进度：按各阶段计划工期加权汇总。
 */
@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(TaskPhase) private readonly phaseRepository: Repository<TaskPhase>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    private readonly auditService: AuditService
  ) {}

  /** 子任务状态变更入口：由阶段定位项目，重算阶段与项目进度。 */
  async recalcFromPhase(phaseId: number, actorId = 1): Promise<Project> {
    const phase = await this.phaseRepository.findOneBy({ id: phaseId });
    if (!phase) {
      throw new NotFoundException('任务阶段不存在');
    }
    return this.recalcProject(phase.projectId, actorId);
  }

  /**
   * 重算单个项目：先刷新各阶段进度（有子任务按工时占比，无子任务保留原值），
   * 再按阶段计划工期加权汇总项目进度。
   */
  async recalcProject(projectId: number, actorId = 1): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['phases', 'phases.subTasks']
    });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    const phases = project.phases ?? [];
    const changedPhases: TaskPhase[] = [];
    for (const phase of phases) {
      const beforePercent = phase.percentComplete;
      const beforeStatus = phase.status;
      this.applyPhaseProgress(phase, phase.subTasks ?? []);
      if (beforePercent !== phase.percentComplete || beforeStatus !== phase.status) {
        changedPhases.push(phase);
      }
    }
    if (changedPhases.length > 0) {
      await this.phaseRepository.save(changedPhases);
    }

    const nextProgress = projectProgressFromPhases(phases);
    const progressChanged = project.progress !== nextProgress;
    project.progress = nextProgress;
    const savedProject = await this.projectRepository.save(project);

    for (const phase of changedPhases) {
      await this.auditService.record('phase.progress.recalc', 'TaskPhase', phase.id, actorId, {
        percentComplete: phase.percentComplete,
        status: phase.status
      });
    }
    if (progressChanged) {
      await this.auditService.record('project.progress.recalc', 'Project', project.id, actorId, { progress: nextProgress });
    }
    return savedProject;
  }

  /** 全量重算：供种子/维护场景统一刷新所有项目的阶段与项目进度。 */
  async recalcAll(actorId = 1): Promise<void> {
    const projects = await this.projectRepository.find({ select: ['id'] });
    for (const project of projects) {
      await this.recalcProject(project.id, actorId);
    }
  }

  /**
   * 将工时占比规则套用到单个阶段（不落库）：
   * - 无子任务：原样保留；
   * - 进度 100%：标记已完成；
   * - 进度未满：已完成的阶段回退为进行中；阻塞(Blocked)状态予以保留。
   */
  private applyPhaseProgress(phase: TaskPhase, subTasks: SubTask[]): void {
    if (!subTasks || subTasks.length === 0) {
      return;
    }
    phase.percentComplete = phasePercentFromTasks(subTasks);
    if (phase.percentComplete >= 100) {
      phase.status = PhaseStatus.Completed;
    } else if (phase.status === PhaseStatus.Completed || phase.status === PhaseStatus.Pending) {
      phase.status = PhaseStatus.InProgress;
    }
  }
}
