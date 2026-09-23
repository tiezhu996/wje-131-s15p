import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuditLogMiddleware } from './middlewares/auditLog.middleware';
import { RequestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { AuditLog } from './models/auditLog.entity';
import { Material } from './models/material.entity';
import { MaterialUsage } from './models/materialUsage.entity';
import { Project } from './models/project.entity';
import { SubTask } from './models/subTask.entity';
import { TaskPhase } from './models/taskPhase.entity';
import { User } from './models/user.entity';
import { AuditRoutesModule } from './routes/audit.routes';
import { MaterialRoutesModule } from './routes/material.routes';
import { ProjectRoutesModule } from './routes/project.routes';
import { SubTaskRoutesModule } from './routes/subTask.routes';
import { TaskPhaseRoutesModule } from './routes/taskPhase.routes';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([User, Project, TaskPhase, SubTask, Material, MaterialUsage, AuditLog]),
    ProjectRoutesModule,
    TaskPhaseRoutesModule,
    SubTaskRoutesModule,
    MaterialRoutesModule,
    AuditRoutesModule
  ],
  providers: [SeedService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware, AuthMiddleware, AuditLogMiddleware).forRoutes('*');
  }
}
