import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../types/enums';
import { TaskPhase } from './taskPhase.entity';
import { User } from './user.entity';

@Entity('sub_tasks')
export class SubTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phaseId: number;

  @ManyToOne(() => TaskPhase, (phase) => phase.subTasks, { onDelete: 'CASCADE' })
  phase: TaskPhase;

  @Column({ length: 140 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.ownedTasks, { eager: true })
  owner: User;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  estimatedHours: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  actualHours: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Todo })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true })
  completedAt?: string | null;
}
