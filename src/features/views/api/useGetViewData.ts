import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ListTasksQuery } from "@/types";

async function getViewData(
  workspaceId: string,
  projectId: string,
  viewId: string,
  query: ListTasksQuery
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/views/${viewId}/data`,
    { params: query }
  );
  return data;
}

export function useGetViewData(
  workspaceId: string,
  projectId: string,
  viewId: string | null,
  query: ListTasksQuery,
  options: { enabled?: boolean } = { enabled: true }
) {
  return useQuery({
    queryKey: ["projects", projectId, "tasks", "view", viewId, query],
    queryFn: () => getViewData(workspaceId, projectId, viewId!, query),
    enabled: !!workspaceId && !!projectId && !!viewId && options.enabled,
  });
}