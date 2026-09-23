import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  action: string;

  @Column({ length: 80 })
  resource: string;

  @Column({ nullable: true })
  resourceId?: number;

  @Column({ nullable: true })
  actorId?: number;

  @Column({ type: 'json', nullable: true })
  payload?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
