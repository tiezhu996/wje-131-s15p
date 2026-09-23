import { UserRole } from './enums';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  role: UserRole;
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

export interface TimesheetRow {
  userId: number;
  userName: string;
  plannedHours: number;
  actualHours: number;
  utilization: number;
}
