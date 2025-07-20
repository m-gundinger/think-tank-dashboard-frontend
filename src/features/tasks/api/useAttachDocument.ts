// src/features/tasks/api/useAttachDocument.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/documents`
      : `/tasks/${taskId}/documents`;

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      attachDocument({ workspaceId, projectId, taskId, formData }),
    onSuccess: () => {
      toast.success("Document attached successfully.");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: (error: any) => {
      toast.error("Failed to attach document", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
