import { useApiResource } from "@/hooks/useApiResource";

export function useManageDeals() {
  const resource = useApiResource("deals", ["deals"]);
  return resource;
}