import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Material } from '../models/material.entity';
import { MaterialUsage } from '../models/materialUsage.entity';
import { Project } from '../models/project.entity';
import { SubTask } from '../models/subTask.entity';
import { TaskPhase } from '../models/taskPhase.entity';
import { User } from '../models/user.entity';

export function databaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'construction_user',
    password: process.env.DB_PASSWORD || 'construction_password',
    database: process.env.DB_NAME || 'construction_tracker',
    entities: [Project, TaskPhase, SubTask, Material, MaterialUsage, User, AuditLog],
    synchronize: true,
    logging: false
  };
}
