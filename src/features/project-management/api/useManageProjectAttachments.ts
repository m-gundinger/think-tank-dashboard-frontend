import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type PluralEntityType = "knowledge-bases" | "whiteboards" | "publications";

interface AttachParams {
  workspaceId: string;
  projectId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function attachEntity(params: AttachParams): Promise<any> {
  const { workspaceId, projectId, entityId, plural } = params;
  const url = `workspaces/${workspaceId}/projects/${projectId}/${plural}`;
  const { data } = await api.post(url, { entityId });
  return data;
}

interface DetachParams {
  workspaceId: string;
  projectId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function detachEntity(params: DetachParams): Promise<void> {
  const { workspaceId, projectId, entityId, plural } = params;
  const url = `workspaces/${workspaceId}/projects/${projectId}/${plural}/${entityId}`;
  await api.delete(url);
}

export function useManageProjectAttachments(
  workspaceId: string,
  projectId: string
) {
  const invalidateQueries = [
    ["projects", workspaceId],
    ["project", projectId],
  ];

  const useAttachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        attachEntity({ workspaceId, projectId, ...data }),
      successMessage: "Attachment added to project.",
      invalidateQueries,
    });
  };

  const useDetachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        detachEntity({ workspaceId, projectId, ...data }),
      successMessage: "Attachment removed from project.",
      invalidateQueries,
    });
  };

  return { useAttachEntity, useDetachEntity };
}
