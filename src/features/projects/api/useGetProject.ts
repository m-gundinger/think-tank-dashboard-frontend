import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getProject(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}`
  );
  return data;
}

export function useGetProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}
