import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type PluralEntityType = "knowledge-bases" | "whiteboards" | "publications";

interface AttachParams {
  workspaceId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function attachEntity(params: AttachParams): Promise<any> {
  const { workspaceId, entityId, plural } = params;
  const url = `workspaces/${workspaceId}/${plural}`;
  const { data } = await api.post(url, { entityId });
  return data;
}

interface DetachParams {
  workspaceId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function detachEntity(params: DetachParams): Promise<void> {
  const { workspaceId, entityId, plural } = params;
  const url = `workspaces/${workspaceId}/${plural}/${entityId}`;
  await api.delete(url);
}

export function useManageWorkspaceAttachments(workspaceId: string) {
  const invalidateQueries = [["workspaces"], ["workspace", workspaceId]];

  const useAttachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        attachEntity({ workspaceId, ...data }),
      successMessage: "Attachment added to workspace.",
      invalidateQueries,
    });
  };

  const useDetachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        detachEntity({ workspaceId, ...data }),
      successMessage: "Attachment removed from workspace.",
      invalidateQueries,
    });
  };

  return { useAttachEntity, useDetachEntity };
}
