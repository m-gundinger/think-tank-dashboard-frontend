import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

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
