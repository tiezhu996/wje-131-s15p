import { apiPaths } from '../constants/apiPaths';
import { DashboardSummary, Project, ProjectStatus } from '../types';
import { getData, patchData, postData } from '../utils/request';

export const projectApi = {
  list: () => getData<Project[]>(apiPaths.projects),
  detail: (id: number) => getData<Project>(`${apiPaths.projects}/${id}`),
  dashboard: () => getData<DashboardSummary>(apiPaths.dashboard),
  create: (payload: Partial<Project>) => postData<Project>(apiPaths.projects, payload),
  updateProgress: (id: number, progress: number, status?: ProjectStatus) =>
    patchData<Project>(`${apiPaths.projects}/${id}/progress`, { progress, status }),
  archive: (id: number) => patchData<Project>(`${apiPaths.projects}/${id}/archive`)
};
