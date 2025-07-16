import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteWorkspace(workspaceId: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}`);
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      toast.success("Workspace deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete workspace", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
