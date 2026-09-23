import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from './material.entity';
import { Project } from './project.entity';
import { TaskPhase } from './taskPhase.entity';
import { User } from './user.entity';

@Entity('material_usages')
export class MaterialUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  materialId: number;

  @ManyToOne(() => Material, (material) => material.usages, { eager: true })
  material: Material;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.materialUsages)
  project: Project;

  @Column()
  phaseId: number;

  @ManyToOne(() => TaskPhase, (phase) => phase.materialUsages)
  phase: TaskPhase;

  @Column('decimal', { precision: 12, scale: 2 })
  quantity: string;

  @Column()
  receiverId: number;

  @ManyToOne(() => User, (user) => user.materialUsages, { eager: true })
  receiver: User;

  @Column({ type: 'date' })
  usedAt: string;

  @Column({ type: 'text' })
  purpose: string;
}
