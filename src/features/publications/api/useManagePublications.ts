import { useApiResource } from "@/hooks/useApiResource";
import { Publication } from "@/types";

export function useManagePublications() {
  const resource = useApiResource<Publication>("publications", [
    "publications",
  ]);
  return resource;
}