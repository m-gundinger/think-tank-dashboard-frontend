import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getComments(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
): Promise<any> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`
      : `/tasks/${taskId}/comments`;
  const { data } = await api.get(url);
  return data;
}

export function useGetComments(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(workspaceId, projectId, taskId),
    enabled: !!taskId,
  });
}
