import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteIntegration(provider: string): Promise<void> {
  await api.delete(`/integrations/${provider}`);
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIntegration,
    onSuccess: () => {
      toast.success("Integration disconnected successfully.");
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
    onError: (error: any) => {
      toast.error("Failed to disconnect", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
