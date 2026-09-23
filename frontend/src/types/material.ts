import { MaterialUnit } from './enums';
import { User } from './project';

export interface Material {
  id: number;
  name: string;
  specification: string;
  unit: MaterialUnit;
  stockQuantity: string;
  unitPrice: string;
  warehouseLocation: string;
  minStockThreshold: string;
}

export interface MaterialUsage {
  id: number;
  materialId: number;
  material?: Material;
  projectId: number;
  phaseId: number;
  quantity: string;
  receiverId: number;
  receiver?: User;
  usedAt: string;
  purpose: string;
}
