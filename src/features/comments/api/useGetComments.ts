import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getComments(
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`
  );
  return data;
}

export function useGetComments(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(workspaceId, projectId, taskId),
    enabled: !!workspaceId && !!projectId && !!taskId,
  });
}
