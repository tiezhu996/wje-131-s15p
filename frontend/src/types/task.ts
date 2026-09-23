import { PhaseStatus, Priority, TaskStatus } from './enums';
import { User } from './project';

export interface TaskPhase {
  id: number;
  projectId: number;
  name: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  percentComplete: number;
  ownerId: number;
  owner?: User;
  priority: Priority;
  status: PhaseStatus;
  subTasks?: SubTask[];
}

export interface SubTask {
  id: number;
  phaseId: number;
  name: string;
  description?: string | null;
  ownerId: number;
  owner?: User;
  estimatedHours: string;
  actualHours: string;
  status: TaskStatus;
  completedAt?: string | null;
}

export interface TimesheetRow {
  userId: number;
  userName: string;
  plannedHours: number;
  actualHours: number;
  utilization: number;
}
