import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from '../types/enums';
import { User } from './user.entity';
import { TaskPhase } from './taskPhase.entity';
import { MaterialUsage } from './materialUsage.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 240 })
  address: string;

  @Column('decimal', { precision: 14, scale: 2 })
  contractAmount: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  plannedEndDate: string;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: string | null;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.Planning })
  status: ProjectStatus;

  @Column({ default: 0 })
  progress: number;

  @Column()
  managerId: number;

  @ManyToOne(() => User, (user) => user.managedProjects, { eager: true })
  manager: User;

  @OneToMany(() => TaskPhase, (phase) => phase.project)
  phases: TaskPhase[];

  @OneToMany(() => MaterialUsage, (usage) => usage.project)
  materialUsages: MaterialUsage[];
}
