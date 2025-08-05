import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { DocumentType } from "@/types/api";

// Attach (Upload)
interface AttachDocumentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  formData: FormData;
}

async function attachDocument({
  workspaceId,
  projectId,
  taskId,
  formData,
}: AttachDocumentParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/documents`
      : `tasks/${taskId}/documents`;

  const { data } = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export function useAttachDocument(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (formData: FormData) =>
      attachDocument({ workspaceId, projectId, taskId, formData }),
    successMessage: "Document attached successfully.",
    invalidateQueries: [["task", taskId]],
  });
}

// Detach
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
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/documents/${documentId}/${type}`
      : `tasks/${taskId}/documents/${documentId}/${type}`;
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

// Link
interface LinkDocumentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  title: string;
  externalUrl: string;
  type: DocumentType;
}

async function linkDocument(params: LinkDocumentParams): Promise<any> {
  const { workspaceId, projectId, taskId, ...linkData } = params;
  const url =
    projectId && workspaceId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/documents`
      : `tasks/${taskId}/documents`;

  // Sending as JSON, not multipart/form-data
  const { data } = await api.post(url, linkData, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export function useLinkDocument(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (data: {
      title: string;
      externalUrl: string;
      type: DocumentType;
    }) => linkDocument({ workspaceId, projectId, taskId, ...data }),
    successMessage: "Document linked successfully.",
    invalidateQueries: [["task", taskId]],
  });
}
