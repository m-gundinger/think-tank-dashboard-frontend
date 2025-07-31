import { useApiResource } from "@/hooks/useApiResource";

export function useManageDealStages() {
  const resource = useApiResource("deal-stages", ["dealStages"]);
  return resource;
}
