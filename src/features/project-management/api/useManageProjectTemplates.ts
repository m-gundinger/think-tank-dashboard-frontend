import { useApiResource } from "@/hooks/useApiResource";
import { ProjectTemplate } from "@/types";

interface ProjectTemplateQuery {
  search?: string;
  page?: number;
  limit?: number;
}
export function useManageProjectTemplates(projectId?: string) {
  const resourceUrl = projectId
    ? `projects/${projectId}/templates`
    : "project-templates";
  const resourceKey = projectId
    ? ["projectTemplates", projectId]
    : ["projectTemplates"];

  return useApiResource<ProjectTemplate, ProjectTemplateQuery>(
    resourceUrl,
    resourceKey
  );
}