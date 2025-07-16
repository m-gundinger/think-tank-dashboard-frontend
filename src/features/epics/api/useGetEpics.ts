import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getEpic(
  workspaceId: string,
  projectId: string,
  epicId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/epics/${epicId}`
  );
  return data;
}

export function useGetEpic(
  workspaceId: string,
  projectId: string,
  epicId: string | null
) {
  return useQuery({
    queryKey: ["epic", epicId],
    queryFn: () => getEpic(workspaceId, projectId, epicId!),
    enabled: !!workspaceId && !!projectId && !!epicId,
  });
}

async function getEpics(workspaceId: string, projectId: string): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`
  );
  return data;
}

export function useGetEpics(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["epics", projectId],
    queryFn: () => getEpics(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}
