import { useApiResource } from "@/hooks/useApiResource";

export function useManagePublicationCategories() {
  const resource = useApiResource("publications/categories", [
    "publicationCategories",
  ]);
  return resource;
}
