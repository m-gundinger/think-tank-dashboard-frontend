import { useApiResource } from "@/hooks/useApiResource";

export function useManageTeams(workspaceId: string) {
  const resource = useApiResource(`/workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
  return resource;
}
