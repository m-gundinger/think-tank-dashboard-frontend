import { useApiResource } from "@/hooks/useApiResource";
import { TaskType } from "@/types";

export function useManageTaskTypes(workspaceId?: string, projectId?: string) {
  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "task-types",
    workspaceId,
    projectId,
  });

  if (!workspaceId && !projectId) {
    const globalResource = useApiResource<TaskType>("task-types", [
      "taskTypes",
      "global",
    ]);
    return globalResource;
  }

  return useApiResource<TaskType>(resourceUrl, resourceKey);
}