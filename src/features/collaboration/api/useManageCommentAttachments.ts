import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type PluralEntityType = "knowledge-bases" | "whiteboards" | "publications";

interface AttachParams {
  commentId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function attachEntity(params: AttachParams): Promise<any> {
  const { commentId, entityId, plural } = params;
  const url = `comments/${commentId}/${plural}`;
  const { data } = await api.post(url, { entityId });
  return data;
}

interface DetachParams {
  commentId: string;
  entityId: string;
  plural: PluralEntityType;
}

async function detachEntity(params: DetachParams): Promise<void> {
  const { commentId, entityId, plural } = params;
  const url = `comments/${commentId}/${plural}/${entityId}`;
  await api.delete(url);
}

export function useManageCommentAttachments(commentId: string, taskId: string) {
  const invalidateQueries = [
    ["comments", taskId],
    ["task", taskId],
  ];

  const useAttachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        attachEntity({ commentId, ...data }),
      successMessage: "Attachment added to comment.",
      invalidateQueries,
    });
  };

  const useDetachEntity = () => {
    return useApiMutation({
      mutationFn: (data: { entityId: string; plural: PluralEntityType }) =>
        detachEntity({ commentId, ...data }),
      successMessage: "Attachment removed from comment.",
      invalidateQueries,
    });
  };

  return { useAttachEntity, useDetachEntity };
}