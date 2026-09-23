import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../types/enums';
import { Project } from './project.entity';
import { TaskPhase } from './taskPhase.entity';
import { SubTask } from './subTask.entity';
import { MaterialUsage } from './materialUsage.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ unique: true, length: 120 })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Worker })
  role: UserRole;

  @OneToMany(() => Project, (project) => project.manager)
  managedProjects: Project[];

  @OneToMany(() => TaskPhase, (phase) => phase.owner)
  ownedPhases: TaskPhase[];

  @OneToMany(() => SubTask, (task) => task.owner)
  ownedTasks: SubTask[];

  @OneToMany(() => MaterialUsage, (usage) => usage.receiver)
  materialUsages: MaterialUsage[];
}
