import { useApiResource } from "@/hooks/useApiResource";
import { Project } from "@/types";

export function useManageProjects(workspaceId: string) {
  const resource = useApiResource<Project>(
    `workspaces/${workspaceId}/projects`,
    ["projects", workspaceId]
  );
  return resource;
}