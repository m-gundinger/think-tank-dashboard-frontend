import { useApiResource } from "@/hooks/useApiResource";

export function useManageIntegrations(workspaceId?: string) {
  const resource = useApiResource("integrations", [
    "integrations",
    workspaceId,
  ]);
  return resource;
}