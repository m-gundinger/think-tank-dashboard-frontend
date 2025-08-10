import { useApiResource } from "@/hooks/useApiResource";
import { Goal } from "@/types";

export function useManageGoals(workspaceId: string, projectId: string) {
  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "goals",
    workspaceId,
    projectId,
  });

  const resource = useApiResource<Goal, any>(resourceUrl, resourceKey);

  return {
    ...resource,
    resourceUrl,
    resourceKey,
  };
}