import { useApiResource } from "@/hooks/useApiResource";
import { TaskTemplate } from "@/types";

interface TaskTemplateQuery {
  search?: string;
  page?: number;
  limit?: number;
  workspaceId?: string;
  projectId?: string;
}

export function useManageTaskTemplates(
  workspaceId?: string,
  projectId?: string
) {
  const resourceUrl = `workspaces/${workspaceId}/projects/${projectId}/task-templates`;
  const resourceKey = ["taskTemplates", projectId];

  const resource = useApiResource<TaskTemplate, TaskTemplateQuery>(
    resourceUrl,
    resourceKey
  );
  return resource;
}