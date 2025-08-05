import { useApiResource } from "@/hooks/useApiResource";
import { Team } from "@/types";

export function useManageTeams(workspaceId: string) {
  const resource = useApiResource<Team>(`workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
  return resource;
}
