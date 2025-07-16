import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWorkflow(workflowId: string): Promise<any> {
  const { data } = await api.get(`/admin/workflows/${workflowId}`);
  return data;
}

export function useGetWorkflow(workflowId: string) {
  return useQuery<any>({
    queryKey: ["workflow", workflowId],
    queryFn: () => getWorkflow(workflowId),
    enabled: !!workflowId,
  });
}
