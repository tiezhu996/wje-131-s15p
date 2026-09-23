import { apiPaths } from '../constants/apiPaths';
import { MaterialUsage } from '../types';
import { getData, postData } from '../utils/request';

export const materialUsageApi = {
  list: (projectId?: number, phaseId?: number) => {
    const query = new URLSearchParams();
    if (projectId) query.set('projectId', String(projectId));
    if (phaseId) query.set('phaseId', String(phaseId));
    return getData<MaterialUsage[]>(`${apiPaths.materialUsage}${query.toString() ? `?${query.toString()}` : ''}`);
  },
  issue: (payload: Partial<MaterialUsage>) => postData<MaterialUsage>(apiPaths.materialUsage, payload)
};
