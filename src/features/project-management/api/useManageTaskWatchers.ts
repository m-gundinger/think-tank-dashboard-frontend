import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface WatcherParams {
  workspaceId?: string | null;
  projectId?: string | null;
  taskId: string;
}

async function addWatcher({
  workspaceId,
  projectId,
  taskId,
}: WatcherParams): Promise<any> {
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/watch`
      : `standalone-tasks/${taskId}/watch`;
  const { data } = await api.post(url);
  return data;
}

async function removeWatcher({
  workspaceId,
  projectId,
  taskId,
}: WatcherParams): Promise<any> {
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/watch`
      : `standalone-tasks/${taskId}/watch`;
  const { data } = await api.delete(url);
  return data;
}

export function useManageTaskWatchers(
  workspaceId: string | null | undefined,
  projectId: string | null | undefined,
  taskId: string
) {
  const invalidateQueries = [["task", taskId]];

  const addWatcherMutation = useApiMutation<any, void>({
    mutationFn: () => addWatcher({ workspaceId, projectId, taskId }),
    successMessage: "You are now watching this task.",
    invalidateQueries,
  });

  const removeWatcherMutation = useApiMutation<any, void>({
    mutationFn: () => removeWatcher({ workspaceId, projectId, taskId }),
    successMessage: "You are no longer watching this task.",
    invalidateQueries,
  });

  return {
    addWatcher: addWatcherMutation.mutate,
    removeWatcher: removeWatcherMutation.mutate,
    isPending: addWatcherMutation.isPending || removeWatcherMutation.isPending,
  };
}
