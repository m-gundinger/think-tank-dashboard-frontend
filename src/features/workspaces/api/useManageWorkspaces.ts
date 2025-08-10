import { useApiResource } from "@/hooks/useApiResource";
import { Workspace } from "@/types";

export function useManageWorkspaces() {
  return useApiResource<Workspace>("workspaces", ["workspaces"]);
}