import { useApiResource } from "@/hooks/useApiResource";
import { Deal } from "@/types";

export function useManageDeals() {
  const resource = useApiResource<Deal>("deals", ["deals"]);
  return resource;
}