import { apiPaths } from '../constants/apiPaths';
import { TaskPhase } from '../types';
import { getData, patchData, postData } from '../utils/request';

export const taskPhaseApi = {
  listByProject: (projectId: number) => getData<TaskPhase[]>(`${apiPaths.taskPhases}/project/${projectId}`),
  create: (payload: Partial<TaskPhase>) => postData<TaskPhase>(apiPaths.taskPhases, payload),
  updateProgress: (id: number, percentComplete: number) =>
    patchData<TaskPhase>(`${apiPaths.taskPhases}/${id}/progress`, { percentComplete }),
  block: (id: number) => patchData<TaskPhase>(`${apiPaths.taskPhases}/${id}/block`),
  unblock: (id: number) => patchData<TaskPhase>(`${apiPaths.taskPhases}/${id}/unblock`)
};
