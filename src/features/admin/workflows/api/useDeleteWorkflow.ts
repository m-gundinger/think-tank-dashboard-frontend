import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteWorkflow(workflowId: string): Promise<void> {
  await api.delete(`/admin/workflows/${workflowId}`);
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete workflow", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
