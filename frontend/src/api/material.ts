import { apiPaths } from '../constants/apiPaths';
import { Material } from '../types';
import { getData, patchData } from '../utils/request';

export const materialApi = {
  list: () => getData<Material[]>(apiPaths.materials),
  receive: (id: number, quantity: number) => patchData<Material>(`${apiPaths.materials}/${id}/receive`, { quantity })
};
