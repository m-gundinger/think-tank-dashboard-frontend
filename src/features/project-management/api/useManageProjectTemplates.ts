import { useApiResource } from "@/hooks/useApiResource";
import { ProjectTemplate } from "@/types";

interface ProjectTemplateQuery {
  search?: string;
  page?: number;
  limit?: number;
}
export function useManageProjectTemplates() {
  const resource = useApiResource<ProjectTemplate, ProjectTemplateQuery>(
    "project-templates",
    ["projectTemplates"]
  );
  return resource;
}
export function useManageProjectSpecificTemplates(
  workspaceId: string,
  projectId: string
) {
  const resource = useApiResource(
    `workspaces/${workspaceId}/projects/${projectId}/templates`,
    ["projectTemplates", projectId]
  );
  return resource;
}
