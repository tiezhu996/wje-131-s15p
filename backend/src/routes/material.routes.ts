import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Material } from '../models/material.entity';
import { MaterialUsage } from '../models/materialUsage.entity';
import { MaterialController } from '../controllers/material.controller';
import { AuditService } from '../services/audit.service';
import { MaterialService } from '../services/material.service';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialUsage, AuditLog])],
  controllers: [MaterialController],
  providers: [MaterialService, AuditService]
})
export class MaterialRoutesModule {}
