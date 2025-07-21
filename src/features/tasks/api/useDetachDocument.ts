import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { DocumentType } from "@/types";

interface DetachDocumentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  documentId: string;
  type: DocumentType;
}

async function detachDocument({
  workspaceId,
  projectId,
  taskId,
  documentId,
  type,
}: DetachDocumentParams): Promise<void> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/documents/${documentId}/${type}`
      : `/tasks/${taskId}/documents/${documentId}/${type}`;
  await api.delete(url);
}

export function useDetachDocument(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (params: { documentId: string; type: DocumentType }) =>
      detachDocument({ workspaceId, projectId, taskId, ...params }),
    successMessage: "Document detached successfully.",
    invalidateQueries: [["task", taskId]],
  });
}
