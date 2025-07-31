import { useApiResource } from "@/hooks/useApiResource";

export function useManageUsers() {
  const resource = useApiResource("admin/users", ["users"]);
  return resource;
}
