import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Project } from '../models/project.entity';
import { TaskPhase } from '../models/taskPhase.entity';
import { AuditService } from './audit.service';
import { ProgressService } from './progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskPhase, Project, AuditLog])],
  providers: [ProgressService, AuditService],
  exports: [ProgressService]
})
export class ProgressModule {}
