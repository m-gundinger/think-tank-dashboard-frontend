import { useApiResource } from "@/hooks/useApiResource";
import { Team } from "@/types";

export function useManageTeams(workspaceId: string) {
  return useApiResource<Team>(`workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
}