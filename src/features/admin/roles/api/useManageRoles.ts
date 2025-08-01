import { useApiResource } from "@/hooks/useApiResource";

export function useManageRoles() {
  const resource = useApiResource("admin/roles", ["roles"]);
  return resource;
}