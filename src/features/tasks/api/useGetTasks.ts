import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTasks(
  workspaceId: string,
  projectId: string,
  query: any
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    { params: query }
  );
  return data;
}

export function useGetTasks(
  workspaceId: string,
  projectId: string,
  query: any,
  options: { enabled?: boolean } = { enabled: true }
) {
  return useQuery({
    queryKey: ["tasks", projectId, query],
    queryFn: () => getTasks(workspaceId, projectId, query),

    enabled: !!workspaceId && !!projectId && options.enabled,
  });
}
