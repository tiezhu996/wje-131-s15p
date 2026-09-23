import { create } from 'zustand';
import { subTaskApi } from '../api/subTask';
import { taskPhaseApi } from '../api/taskPhase';
import { SubTask, TaskPhase, TimesheetRow } from '../types';

interface TaskState {
  phases: TaskPhase[];
  tasks: SubTask[];
  timesheet: TimesheetRow[];
  loadPhases: (projectId: number) => Promise<void>;
  loadTasks: (phaseId: number) => Promise<void>;
  loadTimesheet: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  phases: [],
  tasks: [],
  timesheet: [],
  loadPhases: async (projectId) => {
    const phases = await taskPhaseApi.listByProject(projectId);
    set({ phases, tasks: phases.flatMap((phase) => phase.subTasks || []) });
  },
  loadTasks: async (phaseId) => {
    const tasks = await subTaskApi.listByPhase(phaseId);
    set({ tasks });
  },
  loadTimesheet: async () => {
    const timesheet = await subTaskApi.timesheet();
    set({ timesheet });
  }
}));
