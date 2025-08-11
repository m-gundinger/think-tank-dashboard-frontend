import { useApiResource } from "@/hooks/useApiResource";
import { Role } from "@/types";

export function useManageRoles() {
  return useApiResource<Role>("admin/roles", ["roles"]);
}