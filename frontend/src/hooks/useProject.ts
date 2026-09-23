import { useCallback, useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';

export function useProject(projectId?: number) {
  const { current, loading, loadProject } = useProjectStore();

  const refresh = useCallback(async () => {
    if (projectId) {
      await loadProject(projectId);
    }
  }, [loadProject, projectId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    project: current,
    loading,
    refresh
  };
}
