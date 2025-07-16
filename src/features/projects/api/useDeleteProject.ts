import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteProject({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (projectId) => deleteProject({ workspaceId, projectId }),
    onSuccess: () => {
      toast.success("Project deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete project", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
