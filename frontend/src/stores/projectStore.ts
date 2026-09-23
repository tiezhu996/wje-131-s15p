import { create } from 'zustand';
import { projectApi } from '../api/project';
import { DashboardSummary, Project } from '../types';

interface ProjectState {
  projects: Project[];
  current?: Project;
  dashboard?: DashboardSummary;
  loading: boolean;
  loadProjects: () => Promise<void>;
  loadProject: (id: number) => Promise<void>;
  loadDashboard: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  loadProjects: async () => {
    set({ loading: true });
    const projects = await projectApi.list();
    set({ projects, loading: false });
  },
  loadProject: async (id) => {
    set({ loading: true });
    const current = await projectApi.detail(id);
    set({ current, loading: false });
  },
  loadDashboard: async () => {
    const dashboard = await projectApi.dashboard();
    set({ dashboard });
  }
}));
