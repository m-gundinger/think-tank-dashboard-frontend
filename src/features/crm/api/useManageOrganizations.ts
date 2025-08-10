import { useApiResource } from "@/hooks/useApiResource";
import { Organization } from "@/types";

export function useManageOrganizations() {
  const resource = useApiResource<Organization>("organizations", [
    "organizations",
  ]);
  return resource;
}