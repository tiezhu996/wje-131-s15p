import { create } from 'zustand';
import { materialApi } from '../api/material';
import { materialUsageApi } from '../api/materialUsage';
import { Material, MaterialUsage } from '../types';

interface MaterialState {
  materials: Material[];
  usages: MaterialUsage[];
  loadMaterials: () => Promise<void>;
  loadUsages: (projectId?: number, phaseId?: number) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  usages: [],
  loadMaterials: async () => {
    const materials = await materialApi.list();
    set({ materials });
  },
  loadUsages: async (projectId, phaseId) => {
    const usages = await materialUsageApi.list(projectId, phaseId);
    set({ usages });
  }
}));
