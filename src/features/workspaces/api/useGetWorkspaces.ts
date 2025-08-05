import { useApiResource } from "@/hooks/useApiResource";
import { Workspace } from "@/types";

interface WorkspaceListQuery {
  limit?: number;
}

export function useGetWorkspaces() {
  const resource = useApiResource<Workspace, WorkspaceListQuery>("workspaces", [
    "workspaces",
  ]);
  return resource.useGetAll({ limit: 1000 });
}
