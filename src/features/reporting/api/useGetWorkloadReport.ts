
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetWorkloadParams {
  workspaceId: string;
  projectIds?: string[];
}

async function getWorkloadReport({
  workspaceId,
  projectIds,
}: GetWorkloadParams): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/reporting/workload`,
    {
      params: {
        projectIds: projectIds?.join(","),
      },
    }
  );
  return data;
}

export function useGetWorkloadReport(
  workspaceId: string,
  projectIds?: string[]
) {
  return useQuery({
    queryKey: ["workload", workspaceId, projectIds],
    queryFn: () => getWorkloadReport({ workspaceId, projectIds }),
    enabled: !!workspaceId,
  });
}
