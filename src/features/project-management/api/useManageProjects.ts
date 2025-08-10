import { useApiResource } from "@/hooks/useApiResource";
import { Project } from "@/types";

export function useManageProjects(workspaceId?: string) {
  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "projects",
    workspaceId,
  });

  const resource = useApiResource<Project>(resourceUrl, resourceKey);

  return {
    ...resource,
    resourceUrl,
    resourceKey,
  };
}