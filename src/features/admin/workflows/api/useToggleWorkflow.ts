import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ToggleParams {
  workflowId: string;
  enabled: boolean;
}

async function toggleWorkflow({
  workflowId,
  enabled,
}: ToggleParams): Promise<any> {
  const { data } = await api.post(`/admin/workflows/${workflowId}/toggle`, {
    enabled,
  });
  return data;
}

export function useToggleWorkflow() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ToggleParams>({
    mutationFn: toggleWorkflow,
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(["workflows"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((w: any) =>
            w.id === updatedWorkflow.id ? updatedWorkflow : w
          ),
        };
      });
    },
  });
}
