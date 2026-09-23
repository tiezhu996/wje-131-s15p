import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskPhase } from '../models/taskPhase.entity';
import { PhaseStatus } from '../types/enums';
import { AuditService } from './audit.service';

@Injectable()
export class TaskPhaseService {
  constructor(
    @InjectRepository(TaskPhase) private readonly phaseRepository: Repository<TaskPhase>,
    private readonly auditService: AuditService
  ) {}

  async findByProject(projectId: number) {
    return this.phaseRepository.find({ where: { projectId }, relations: ['subTasks'], order: { plannedStartDate: 'ASC' } });
  }

  async create(payload: Partial<TaskPhase>, actorId = 1) {
    const phase = await this.phaseRepository.save(this.phaseRepository.create(payload));
    await this.auditService.record('phase.create', 'TaskPhase', phase.id, actorId, payload);
    return phase;
  }

  async updateProgress(id: number, percentComplete: number, actorId = 1) {
    const phase = await this.phaseRepository.findOneBy({ id });
    if (!phase) {
      throw new NotFoundException('任务阶段不存在');
    }
    phase.percentComplete = percentComplete;
    phase.status = percentComplete >= 100 ? PhaseStatus.Completed : PhaseStatus.InProgress;
    const updated = await this.phaseRepository.save(phase);
    await this.auditService.record('phase.progress.update', 'TaskPhase', id, actorId, { percentComplete });
    return updated;
  }

  async setBlocked(id: number, blocked: boolean, actorId = 1) {
    const phase = await this.phaseRepository.findOneBy({ id });
    if (!phase) {
      throw new NotFoundException('任务阶段不存在');
    }
    phase.status = blocked ? PhaseStatus.Blocked : PhaseStatus.InProgress;
    const updated = await this.phaseRepository.save(phase);
    await this.auditService.record(blocked ? 'phase.block' : 'phase.unblock', 'TaskPhase', id, actorId);
    return updated;
  }
}
