import { useApiResource } from "@/hooks/useApiResource";

export function useManageWorkspaces() {
  const resource = useApiResource("workspaces", ["workspaces"]);
  return resource;
}
