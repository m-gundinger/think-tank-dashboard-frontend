import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetWorkloadParams {
  workspaceId?: string;
  projectIds?: string[];
}

async function getWorkloadReport({
  workspaceId,
  projectIds,
}: GetWorkloadParams): Promise<any> {
  const url = workspaceId
    ? `/workspaces/${workspaceId}/reporting/workload`
    : "/reporting/workload";
  const { data } = await api.get(url, {
    params: {
      projectIds: projectIds?.join(","),
    },
  });
  return data;
}

export function useGetWorkloadReport(
  workspaceId?: string,
  projectIds?: string[]
) {
  return useQuery({
    queryKey: ["workload", workspaceId || "global", projectIds],
    queryFn: () => getWorkloadReport({ workspaceId, projectIds }),
  });
}