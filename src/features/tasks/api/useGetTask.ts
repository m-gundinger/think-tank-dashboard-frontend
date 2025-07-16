import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTask(
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
  return data;
}

export function useGetTask(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(workspaceId, projectId, taskId),
    enabled: !!workspaceId && !!projectId && !!taskId,
  });
}
