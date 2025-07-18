import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTask(
  taskId: string,
  workspaceId?: string,
  projectId?: string
): Promise<any> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
      : `/tasks/${taskId}`;
  const { data } = await api.get(url);
  return data;
}

export function useGetTask(
  taskId: string | null,
  workspaceId?: string,
  projectId?: string
) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId!, workspaceId, projectId),
    enabled: !!taskId,
  });
}
