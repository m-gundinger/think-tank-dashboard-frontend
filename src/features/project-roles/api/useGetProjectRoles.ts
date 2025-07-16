import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getProjectRoles(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`
  );
  return data;
}

export function useGetProjectRoles(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["projectRoles", projectId],
    queryFn: () => getProjectRoles(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}
