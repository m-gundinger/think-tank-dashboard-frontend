import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getTimeLogs(
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/timelogs`
  );
  return data;
}

export function useGetTimeLogs(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useQuery({
    queryKey: ["timeLogs", taskId],
    queryFn: () => getTimeLogs(workspaceId, projectId, taskId),
    enabled: !!workspaceId && !!projectId && !!taskId,
  });
}
