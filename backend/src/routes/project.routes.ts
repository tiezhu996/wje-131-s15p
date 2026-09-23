import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { MaterialUsage } from '../models/materialUsage.entity';
import { Project } from '../models/project.entity';
import { ProjectController } from '../controllers/project.controller';
import { AuditService } from '../services/audit.service';
import { ProjectService } from '../services/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, MaterialUsage, AuditLog])],
  controllers: [ProjectController],
  providers: [ProjectService, AuditService],
  exports: [ProjectService]
})
export class ProjectRoutesModule {}
