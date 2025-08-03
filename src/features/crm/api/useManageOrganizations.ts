import { useApiResource } from "@/hooks/useApiResource";

export function useManageOrganizations() {
  const resource = useApiResource("organizations", ["organizations"]);
  return resource;
}