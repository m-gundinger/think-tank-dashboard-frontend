import { useApiResource } from "@/hooks/useApiResource";

export function useManageIntegrations() {
  const resource = useApiResource("integrations/configurations", [
    "integrations",
  ]);
  return resource;
}
