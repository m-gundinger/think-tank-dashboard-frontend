import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

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
  return useApiMutation<any, ToggleParams>({
    mutationFn: toggleWorkflow,
    invalidateQueries: [["workflows"]],
  });
}