import { useApiResource } from "@/hooks/useApiResource";
import { Project } from "@/types";

interface ProjectListQuery {
  limit?: number;
}

export function useGetProjects(workspaceId?: string) {
  const resourceUrl = workspaceId
    ? `workspaces/${workspaceId}/projects`
    : `projects`;
  const resourceKey = workspaceId
    ? ["projects", workspaceId]
    : ["projects", "all"];

  const resource = useApiResource<Project, ProjectListQuery>(
    resourceUrl,
    resourceKey
  );
  return resource.useGetAll({ limit: 1000, enabled: !!workspaceId });
}