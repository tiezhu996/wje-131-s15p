import { apiPaths } from '../constants/apiPaths';
import { SubTask, TaskStatus, TimesheetRow } from '../types';
import { getData, patchData, postData } from '../utils/request';

export const subTaskApi = {
  listByPhase: (phaseId: number) => getData<SubTask[]>(`${apiPaths.subTasks}/phase/${phaseId}`),
  create: (payload: Partial<SubTask>) => postData<SubTask>(apiPaths.subTasks, payload),
  updateStatus: (id: number, status: TaskStatus) => patchData<SubTask>(`${apiPaths.subTasks}/${id}/status`, { status }),
  timesheet: () => getData<TimesheetRow[]>(apiPaths.timesheet)
};
