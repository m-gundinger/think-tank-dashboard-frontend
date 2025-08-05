import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse, WorkflowRun } from "@/types";

async function getWorkflowRuns(
  workflowId: string,
  query: any
): Promise<PaginatedResponse<WorkflowRun>> {
  const { data } = await api.get(`/admin/workflows/${workflowId}/runs`, {
    params: query,
  });
  return data;
}

export function useGetWorkflowRuns(workflowId: string, query: any) {
  return useQuery<PaginatedResponse<WorkflowRun>>({
    queryKey: ["workflow-runs", workflowId, query],
    queryFn: () => getWorkflowRuns(workflowId, query),
    enabled: !!workflowId,
  });
}