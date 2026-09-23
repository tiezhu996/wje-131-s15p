import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { SubTask } from '../models/subTask.entity';
import { SubTaskController } from '../controllers/subTask.controller';
import { AuditService } from '../services/audit.service';
import { SubTaskService } from '../services/subTask.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubTask, AuditLog])],
  controllers: [SubTaskController],
  providers: [SubTaskService, AuditService]
})
export class SubTaskRoutesModule {}
