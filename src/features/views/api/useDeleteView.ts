import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteViewParams {
  workspaceId: string;
  projectId: string;
  viewId: string;
}

async function deleteView({
  workspaceId,
  projectId,
  viewId,
}: DeleteViewParams): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/views/${viewId}`
  );
}

export function useDeleteView(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (viewId) => deleteView({ workspaceId, projectId, viewId }),
    onSuccess: () => {
      toast.success("View deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["views", projectId] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete view", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
