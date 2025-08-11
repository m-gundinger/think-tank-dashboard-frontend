import { useApiResource } from "@/hooks/useApiResource";
import { Team } from "@/types";

export function useManageTeams(workspaceId: string) {
  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "teams",
    workspaceId,
  });
  return useApiResource<Team>(resourceUrl, resourceKey);
}