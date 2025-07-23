
import { useApiResource } from "@/hooks/useApiResource";

export function useManageSprints(workspaceId: string, projectId: string) {
  const sprintResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/sprints`,
    ["sprints", projectId]
  );
  return sprintResource;
}