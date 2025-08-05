import { useApiResource } from "@/hooks/useApiResource";
import { PublicationCategory } from "@/types";

export function useManagePublicationCategories() {
  const resource = useApiResource<PublicationCategory>(
    "publications/categories",
    ["publicationCategories"]
  );
  return resource;
}