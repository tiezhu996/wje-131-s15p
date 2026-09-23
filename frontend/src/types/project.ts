import { ProjectStatus } from './enums';
import { MaterialUsage } from './material';
import { TaskPhase } from './task';

export interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface Project {
  id: number;
  name: string;
  address: string;
  contractAmount: string;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string | null;
  status: ProjectStatus;
  progress: number;
  managerId: number;
  manager?: User;
  phases?: TaskPhase[];
  materialUsages?: MaterialUsage[];
}

export interface DashboardSummary {
  activeProjects: number;
  delayedProjects: number;
  averageProgress: number;
  materialUsageTop: Array<{
    materialName: string;
    quantity: number;
    unit: string;
  }>;
}
