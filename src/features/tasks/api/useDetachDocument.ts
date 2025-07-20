// src/features/tasks/api/useDetachDocument.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { documentId: string; type: DocumentType }) =>
      detachDocument({ workspaceId, projectId, taskId, ...params }),
    onSuccess: () => {
      toast.success("Document detached successfully.");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: (error: any) => {
      toast.error("Failed to detach document", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}