import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../models/project.entity';
import { SubTask } from '../models/subTask.entity';
import { TaskPhase } from '../models/taskPhase.entity';
import { PhaseStatus, TaskStatus } from '../types/enums';
import { AuditService } from './audit.service';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(TaskPhase) private readonly phaseRepository: Repository<TaskPhase>,
    @InjectRepository(SubTask) private readonly taskRepository: Repository<SubTask>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    private readonly auditService: AuditService
  ) {}

  /** 子任务状态/构成变化后，自底向上重算所属阶段与项目的进度 */
  async recalcAfterTaskChange(phaseId: number, actorId = 1) {
    const phase = await this.recalcPhaseProgress(phaseId, actorId);
    if (phase) {
      await this.recalcProjectProgress(phase.projectId, actorId);
    }
  }

  /** 全量校准（种子数据初始化后调用），保证各视图读到同一组数值 */
  async recalcAll(actorId = 1) {
    const phases = await this.phaseRepository.find({ order: { id: 'ASC' } });
    for (const phase of phases) {
      await this.recalcPhaseProgress(phase.id, actorId);
    }
    const projects = await this.projectRepository.find({ order: { id: 'ASC' } });
    for (const project of projects) {
      await this.recalcProjectProgress(project.id, actorId);
    }
  }

  /** 阶段进度 = 已完成子任务预计工时 / 全部子任务预计工时；没有子任务的阶段保留原进度 */
  async recalcPhaseProgress(phaseId: number, actorId = 1): Promise<TaskPhase | null> {
    const phase = await this.phaseRepository.findOne({ where: { id: phaseId }, relations: ['subTasks'] });
    if (!phase) {
      return null;
    }
    const tasks = phase.subTasks || [];
    if (tasks.length === 0) {
      return phase;
    }

    const doneTasks = tasks.filter((task) => task.status === TaskStatus.Done);
    const totalHours = tasks.reduce((sum, task) => sum + Number(task.estimatedHours), 0);
    const doneHours = doneTasks.reduce((sum, task) => sum + Number(task.estimatedHours), 0);
    // 工时未估算（总和为 0）时退化为按任务数量占比，保证“全部完成即 100%”始终成立
    const percent =
      totalHours > 0
        ? Math.round((doneHours / totalHours) * 100)
        : Math.round((doneTasks.length / tasks.length) * 100);
    const completed = percent >= 100;

    const nextStatus =
      phase.status === PhaseStatus.Blocked
        ? PhaseStatus.Blocked // 阻塞状态由人工解除，自动重算只更新百分比
        : completed
          ? PhaseStatus.Completed
          : phase.status === PhaseStatus.Completed
            ? PhaseStatus.InProgress // 任务退回后比例下降，阶段随之退出已完成
            : phase.status;

    if (phase.percentComplete === percent && phase.status === nextStatus) {
      return phase;
    }

    phase.percentComplete = percent;
    phase.status = nextStatus;
    if (completed) {
      phase.actualEndDate ||= new Date().toISOString().slice(0, 10);
    } else if (nextStatus !== PhaseStatus.Completed) {
      phase.actualEndDate = null;
    }
    const saved = await this.phaseRepository.save(phase);
    await this.auditService.record('phase.progress.recalc', 'TaskPhase', phase.id, actorId, {
      percentComplete: percent,
      status: nextStatus
    });
    return saved;
  }

  /** 项目进度 = 各阶段进度按计划工期（天）加权汇总；没有阶段的保留原进度 */
  async recalcProjectProgress(projectId: number, actorId = 1): Promise<Project | null> {
    const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['phases'] });
    if (!project || !project.phases || project.phases.length === 0) {
      return project;
    }

    let totalWeight = 0;
    let weightedSum = 0;
    let plainSum = 0;
    for (const phase of project.phases) {
      const days = Math.max(
        0,
        Math.round((Date.parse(phase.plannedEndDate) - Date.parse(phase.plannedStartDate)) / DAY_MS)
      );
      totalWeight += days;
      weightedSum += days * phase.percentComplete;
      plainSum += phase.percentComplete;
    }
    // 全部阶段工期为 0 天时退化为简单平均，避免除零
    const progress =
      totalWeight > 0 ? Math.round(weightedSum / totalWeight) : Math.round(plainSum / project.phases.length);

    if (project.progress === progress) {
      return project;
    }
    project.progress = progress;
    const saved = await this.projectRepository.save(project);
    await this.auditService.record('project.progress.recalc', 'Project', project.id, actorId, { progress });
    return saved;
  }
}
