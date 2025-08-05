import { useApiResource } from "@/hooks/useApiResource";

export function useManageIntegrations() {
  const resource = useApiResource("integrations", ["integrations"]);
  return resource;
}