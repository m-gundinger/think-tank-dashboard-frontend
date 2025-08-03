import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type PluralEntityType = "knowledge-bases" | "whiteboards" | "publications";

interface AttachParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function attachEntity(params: AttachParams): Promise<any> {
  const { workspaceId, projectId, taskId, entityId, plural } = params;
  const url = `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/${plural}`;
  const { data } = await api.post(url, { entityId });
  return data;
}

interface DetachParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function detachEntity(params: DetachParams): Promise<void> {
  const { workspaceId, projectId, taskId, entityId, plural } = params;
  const url = `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/${plural}/${entityId}`;
  await api.delete(url);
}

export function useManageTaskAttachments(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const useAttachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        attachEntity({ workspaceId, projectId, taskId, ...data }),
      successMessage: "Attachment added.",
      invalidateQueries: [["task", taskId]],
    });
  };

  const useDetachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        detachEntity({ workspaceId, projectId, taskId, ...data }),
      successMessage: "Attachment removed.",
      invalidateQueries: [["task", taskId]],
    });
  };

  return { useAttachEntity, useDetachEntity };
}
