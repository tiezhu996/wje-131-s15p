import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaterialUnit } from '../types/enums';
import { MaterialUsage } from './materialUsage.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120 })
  specification: string;

  @Column({ type: 'enum', enum: MaterialUnit })
  unit: MaterialUnit;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  stockQuantity: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  unitPrice: string;

  @Column({ length: 120 })
  warehouseLocation: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  minStockThreshold: string;

  @OneToMany(() => MaterialUsage, (usage) => usage.material)
  usages: MaterialUsage[];
}
