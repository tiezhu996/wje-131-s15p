import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PhaseStatus, Priority } from '../types/enums';
import { Project } from './project.entity';
import { User } from './user.entity';
import { SubTask } from './subTask.entity';
import { MaterialUsage } from './materialUsage.entity';

@Entity('task_phases')
export class TaskPhase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.phases, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'date' })
  plannedStartDate: string;

  @Column({ type: 'date' })
  plannedEndDate: string;

  @Column({ type: 'date', nullable: true })
  actualStartDate?: string | null;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: string | null;

  @Column({ default: 0 })
  percentComplete: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.ownedPhases, { eager: true })
  owner: User;

  @Column({ type: 'enum', enum: Priority, default: Priority.Medium })
  priority: Priority;

  @Column({ type: 'enum', enum: PhaseStatus, default: PhaseStatus.Pending })
  status: PhaseStatus;

  @OneToMany(() => SubTask, (task) => task.phase)
  subTasks: SubTask[];

  @OneToMany(() => MaterialUsage, (usage) => usage.phase)
  materialUsages: MaterialUsage[];
}
