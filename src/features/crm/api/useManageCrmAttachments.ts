import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type CrmEntityType = "organizations" | "people";
type PluralAttachmentType = "publications";

interface AttachParams {
  entityType: CrmEntityType;
  entityId: string;
  attachmentId: string;
  plural: PluralAttachmentType;
}

async function attachEntity({
  entityType,
  entityId,
  attachmentId,
  plural,
}: AttachParams): Promise<any> {
  const url = `${entityType}/${entityId}/${plural}`;
  const { data } = await api.post(url, { entityId: attachmentId });
  return data;
}

interface DetachParams {
  entityType: CrmEntityType;
  entityId: string;
  attachmentId: string;
  plural: PluralAttachmentType;
}

async function detachEntity({
  entityType,
  entityId,
  attachmentId,
  plural,
}: DetachParams): Promise<void> {
  const url = `${entityType}/${entityId}/${plural}/${attachmentId}`;
  await api.delete(url);
}

export function useManageCrmAttachments(
  entityType: CrmEntityType,
  entityId: string
) {
  const invalidateQueries: (string | null | undefined)[][] = [
    [entityType],
    [`${entityType.slice(0, -1)}`, entityId],
  ];

  const useAttachPublication = () => {
    return useApiMutation({
      mutationFn: (attachmentId: string) =>
        attachEntity({
          entityType,
          entityId,
          attachmentId,
          plural: "publications",
        }),
      successMessage: "Publication attached successfully.",
      invalidateQueries,
    });
  };

  const useDetachPublication = () => {
    return useApiMutation({
      mutationFn: (attachmentId: string) =>
        detachEntity({
          entityType,
          entityId,
          attachmentId,
          plural: "publications",
        }),
      successMessage: "Publication removed successfully.",
      invalidateQueries,
    });
  };

  return { useAttachPublication, useDetachPublication };
}