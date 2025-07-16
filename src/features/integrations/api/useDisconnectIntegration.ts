import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function disconnectIntegration(provider: string): Promise<void> {
  await api.delete(`/integrations/${provider}`);
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: disconnectIntegration,
    onSuccess: (_, provider) => {
      toast.success(`${provider} has been disconnected.`);
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
    onError: (error: any, provider) => {
      toast.error(`Failed to disconnect ${provider}`, {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
