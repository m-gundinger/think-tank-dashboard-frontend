import { useApiResource } from "@/hooks/useApiResource";

export function useManageInteractions() {
  const resource = useApiResource("/interactions", ["interactions"]);
  return resource;
}