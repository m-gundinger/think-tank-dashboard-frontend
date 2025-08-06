import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { TaskLinkType } from "@/types/api";

interface AddLinkParams {
  workspaceId?: string | null;
  projectId?: string | null;
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
  workspaceId?: string | null;
  projectId?: string | null;
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
  workspaceId?: string | null;
  projectId?: string | null;
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
  workspaceId?: string | null,
  projectId?: string | null
) {
  const addLinkMutation = useApiMutation<
    any,
    Omit<AddLinkParams, "workspaceId" | "projectId">
  >({
    mutationFn: (params) => addLink({ workspaceId, projectId, ...params }),
    successMessage: "Task dependency created.",
    invalidateQueries: (_data, variables) => [
      ["task", variables.sourceTaskId],
      ["task", variables.targetTaskId],
    ],
  });

  const removeLinkMutation = useApiMutation<
    any,
    Omit<RemoveLinkParams, "workspaceId" | "projectId">
  >({
    mutationFn: (params) => removeLink({ workspaceId, projectId, ...params }),
    successMessage: "Task dependency removed.",
    invalidateQueries: (_data, variables) => [["task", variables.taskId]],
  });

  const updateLinkMutation = useApiMutation<
    any,
    Omit<UpdateLinkParams, "workspaceId" | "projectId">
  >({
    mutationFn: (params) => updateLink({ workspaceId, projectId, ...params }),
    successMessage: "Task dependency updated.",
    invalidateQueries: (_data, variables) => [["task", variables.taskId]],
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