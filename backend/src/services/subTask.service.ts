import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubTask } from '../models/subTask.entity';
import { TaskStatus } from '../types/enums';
import { AuditService } from './audit.service';
import { ProgressService } from './progress.service';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectRepository(SubTask) private readonly taskRepository: Repository<SubTask>,
    private readonly auditService: AuditService,
    private readonly progressService: ProgressService
  ) {}

  async findByPhase(phaseId: number) {
    return this.taskRepository.find({ where: { phaseId }, order: { id: 'ASC' } });
  }

  async create(payload: Partial<SubTask>, actorId = 1) {
    const task = await this.taskRepository.save(this.taskRepository.create(payload));
    await this.auditService.record('subtask.create', 'SubTask', task.id, actorId, payload);
    // 新增子任务会改变阶段总工时基数，需同步重算阶段与项目进度
    await this.progressService.recalcFromPhase(task.phaseId, actorId);
    return task;
  }

  async updateStatus(id: number, status: TaskStatus, actorId = 1) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('子任务不存在');
    }

    // 幂等：重复提交同一状态不重复落库、不再次改变进度
    if (task.status === status) {
      return task;
    }

    const previousStatus = task.status;
    task.status = status;
    task.completedAt = status === TaskStatus.Done ? new Date().toISOString().slice(0, 10) : null;
    const updated = await this.taskRepository.save(task);
    await this.auditService.record('subtask.status.update', 'SubTask', id, actorId, {
      from: previousStatus,
      to: status
    });
    // 按已完成子任务预计工时占比重算阶段进度，并联动汇总项目进度
    await this.progressService.recalcFromPhase(task.phaseId, actorId);
    return updated;
  }

  async timesheet() {
    const tasks = await this.taskRepository.find({ relations: ['owner', 'phase'] });
    const rows = tasks.reduce<Record<number, { userId: number; userName: string; plannedHours: number; actualHours: number; utilization: number }>>(
      (acc, task) => {
        const key = task.ownerId;
        acc[key] ||= { userId: task.ownerId, userName: task.owner.name, plannedHours: 0, actualHours: 0, utilization: 0 };
        acc[key].plannedHours += Number(task.estimatedHours);
        acc[key].actualHours += Number(task.actualHours);
        acc[key].utilization = acc[key].plannedHours ? Math.round((acc[key].actualHours / acc[key].plannedHours) * 100) : 0;
        return acc;
      },
      {}
    );
    return Object.values(rows);
  }
}
