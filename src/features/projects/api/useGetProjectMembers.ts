import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getProjectMembers(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/members`
  );
  return data;
}

export function useGetProjectMembers(
  workspaceId: string,
  projectId: string,
  options: { enabled?: boolean } = { enabled: true }
) {
  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId && !!options.enabled,
  });
}
