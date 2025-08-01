import { useApiResource } from "@/hooks/useApiResource";

export function useManageCompanies() {
  const resource = useApiResource("organizations", ["organizations"]);
  return resource;
}