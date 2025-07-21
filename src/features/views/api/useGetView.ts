import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getView(
  workspaceId: string,
  projectId: string,
  viewId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/views/${viewId}`
  );
  return data;
}

export function useGetView(
  workspaceId: string,
  projectId: string,
  viewId: string | null
) {
  return useQuery({
    queryKey: ["view", viewId],
    queryFn: () => getView(workspaceId, projectId, viewId!),
    enabled: !!workspaceId && !!projectId && !!viewId,
  });
}
