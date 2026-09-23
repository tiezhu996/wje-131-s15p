import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../models/material.entity';
import { MaterialUsage } from '../models/materialUsage.entity';
import { Project } from '../models/project.entity';
import { SubTask } from '../models/subTask.entity';
import { TaskPhase } from '../models/taskPhase.entity';
import { User } from '../models/user.entity';
import { MaterialUnit, PhaseStatus, Priority, ProjectStatus, TaskStatus, UserRole } from '../types/enums';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(TaskPhase) private readonly phaseRepository: Repository<TaskPhase>,
    @InjectRepository(SubTask) private readonly taskRepository: Repository<SubTask>,
    @InjectRepository(Material) private readonly materialRepository: Repository<Material>,
    @InjectRepository(MaterialUsage) private readonly usageRepository: Repository<MaterialUsage>
  ) {}

  async onModuleInit() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      return;
    }

    const users = await this.userRepository.save([
      { name: '林雨辰', email: 'pm@example.com', role: UserRole.ProjectManager },
      { name: '陈建安', email: 'foreman@example.com', role: UserRole.Foreman },
      { name: '赵明', email: 'worker@example.com', role: UserRole.Worker },
      { name: '系统管理员', email: 'admin@example.com', role: UserRole.Admin }
    ]);

    const projects = await this.projectRepository.save([
      {
        name: '东城综合体一期',
        address: '上海市浦东新区临港大道 188 号',
        contractAmount: '128000000.00',
        startDate: '2026-03-01',
        plannedEndDate: '2026-12-20',
        status: ProjectStatus.InProgress,
        progress: 46,
        managerId: users[0].id
      },
      {
        name: '北岸仓储中心改造',
        address: '苏州市工业园区港田路 99 号',
        contractAmount: '42000000.00',
        startDate: '2026-02-10',
        plannedEndDate: '2026-09-30',
        status: ProjectStatus.Delayed,
        progress: 38,
        managerId: users[0].id
      }
    ]);

    const phases = await this.phaseRepository.save([
      {
        projectId: projects[0].id,
        name: '桩基与土方',
        plannedStartDate: '2026-03-01',
        plannedEndDate: '2026-04-30',
        actualStartDate: '2026-03-02',
        actualEndDate: '2026-05-05',
        percentComplete: 100,
        ownerId: users[1].id,
        priority: Priority.High,
        status: PhaseStatus.Completed
      },
      {
        projectId: projects[0].id,
        name: '主体结构三层',
        plannedStartDate: '2026-05-06',
        plannedEndDate: '2026-07-30',
        actualStartDate: '2026-05-08',
        percentComplete: 58,
        ownerId: users[1].id,
        priority: Priority.Critical,
        status: PhaseStatus.InProgress
      },
      {
        projectId: projects[1].id,
        name: '钢结构加固',
        plannedStartDate: '2026-04-01',
        plannedEndDate: '2026-06-20',
        actualStartDate: '2026-04-04',
        percentComplete: 42,
        ownerId: users[1].id,
        priority: Priority.Critical,
        status: PhaseStatus.Blocked
      }
    ]);

    await this.taskRepository.save([
      {
        phaseId: phases[0].id,
        name: '基坑支护复测',
        description: '复核支护桩位移数据并提交监理确认',
        ownerId: users[2].id,
        estimatedHours: '18.00',
        actualHours: '20.00',
        status: TaskStatus.Done,
        completedAt: '2026-04-18'
      },
      {
        phaseId: phases[1].id,
        name: '三层梁板钢筋绑扎',
        description: '完成 A 区梁板钢筋绑扎与隐蔽验收',
        ownerId: users[2].id,
        estimatedHours: '36.00',
        actualHours: '25.00',
        status: TaskStatus.InProgress
      },
      {
        phaseId: phases[1].id,
        name: '模板复核',
        description: '复核层高、轴线与支撑体系',
        ownerId: users[1].id,
        estimatedHours: '12.00',
        actualHours: '8.00',
        status: TaskStatus.Review
      },
      {
        phaseId: phases[2].id,
        name: '加固节点图纸会审',
        description: '等待设计院确认节点变更',
        ownerId: users[1].id,
        estimatedHours: '10.00',
        actualHours: '6.00',
        status: TaskStatus.Todo
      }
    ]);

    const materials = await this.materialRepository.save([
      {
        name: 'HRB400 钢筋',
        specification: '直径 16mm',
        unit: MaterialUnit.Ton,
        stockQuantity: '86.50',
        unitPrice: '3950.00',
        warehouseLocation: 'A1 钢筋棚',
        minStockThreshold: '30.00'
      },
      {
        name: '商品混凝土',
        specification: 'C35',
        unit: MaterialUnit.CubicMeter,
        stockQuantity: '120.00',
        unitPrice: '465.00',
        warehouseLocation: '按需直供',
        minStockThreshold: '60.00'
      },
      {
        name: '模板扣件',
        specification: '48mm 通用型',
        unit: MaterialUnit.Piece,
        stockQuantity: '420.00',
        unitPrice: '8.50',
        warehouseLocation: 'B2 周转仓',
        minStockThreshold: '600.00'
      }
    ]);

    await this.usageRepository.save([
      {
        materialId: materials[0].id,
        projectId: projects[0].id,
        phaseId: phases[1].id,
        quantity: '18.40',
        receiverId: users[1].id,
        usedAt: '2026-06-03',
        purpose: '三层梁板钢筋绑扎'
      },
      {
        materialId: materials[1].id,
        projectId: projects[0].id,
        phaseId: phases[1].id,
        quantity: '52.00',
        receiverId: users[1].id,
        usedAt: '2026-06-06',
        purpose: 'A 区楼面浇筑'
      },
      {
        materialId: materials[2].id,
        projectId: projects[1].id,
        phaseId: phases[2].id,
        quantity: '180.00',
        receiverId: users[2].id,
        usedAt: '2026-06-08',
        purpose: '加固施工临边支撑'
      }
    ]);
  }
}
