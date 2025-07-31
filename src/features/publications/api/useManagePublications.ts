import { useApiResource } from "@/hooks/useApiResource";

export function useManagePublications() {
  const resource = useApiResource("publications", ["publications"]);
  return resource;
}
