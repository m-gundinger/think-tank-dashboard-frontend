import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getWorkflowRuns(workflowId: string, query: any): Promise<any> {
  const { data } = await api.get(`/admin/workflows/${workflowId}/runs`, {
    params: query,
  });
  return data;
}

export function useGetWorkflowRuns(workflowId: string, query: any) {
  return useQuery<any>({
    queryKey: ["workflow-runs", workflowId, query],
    queryFn: () => getWorkflowRuns(workflowId, query),
    enabled: !!workflowId,
  });
}
