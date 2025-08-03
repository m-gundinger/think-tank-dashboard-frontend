import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { TaskLinkType } from "@/types/api";

interface AddLinkParams {
  workspaceId?: string;
  projectId?: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: TaskLinkType;
}

async function addLink({
  workspaceId,
  projectId,
  sourceTaskId,
  targetTaskId,
  type,
}: AddLinkParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${sourceTaskId}/links`
      : `tasks/${sourceTaskId}/links`;
  const { data } = await api.post(url, { targetTaskId, type });
  return data;
}

interface RemoveLinkParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  linkId: string;
}

async function removeLink({
  workspaceId,
  projectId,
  taskId,
  linkId,
}: RemoveLinkParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/links/${linkId}`
      : `tasks/${taskId}/links/${linkId}`;
  const { data } = await api.delete(url);
  return data;
}

interface UpdateLinkParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  linkId: string;
  type: TaskLinkType;
}

async function updateLink({
  workspaceId,
  projectId,
  taskId,
  linkId,
  type,
}: UpdateLinkParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/links/${linkId}`
      : `tasks/${taskId}/links/${linkId}`;
  const { data } = await api.patch(url, { type });
  return data;
}

export function useManageTaskLinks(
  workspaceId?: string,
  projectId?: string,
  taskId?: string
) {
  const invalidateQueries = [["task", taskId]];
  if (projectId) {
    invalidateQueries.push(["tasks", projectId]);
  }

  const addLinkMutation = useApiMutation<
    any,
    Omit<AddLinkParams, "workspaceId" | "projectId" | "sourceTaskId">
  >({
    mutationFn: (params) =>
      addLink({ workspaceId, projectId, sourceTaskId: taskId!, ...params }),
    successMessage: "Task dependency created.",
    invalidateQueries,
  });

  const removeLinkMutation = useApiMutation<
    any,
    Omit<RemoveLinkParams, "workspaceId" | "projectId" | "taskId">
  >({
    mutationFn: (params) =>
      removeLink({ workspaceId, projectId, taskId: taskId!, ...params }),
    successMessage: "Task dependency removed.",
    invalidateQueries,
  });

  const updateLinkMutation = useApiMutation<
    any,
    Omit<UpdateLinkParams, "workspaceId" | "projectId" | "taskId">
  >({
    mutationFn: (params) =>
      updateLink({ workspaceId, projectId, taskId: taskId!, ...params }),
    successMessage: "Task dependency updated.",
    invalidateQueries,
  });

  return {
    addLink: addLinkMutation.mutate,
    removeLink: removeLinkMutation.mutate,
    updateLink: updateLinkMutation.mutate,
    isPending:
      addLinkMutation.isPending ||
      removeLinkMutation.isPending ||
      updateLinkMutation.isPending,
  };
}