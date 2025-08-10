import { useApiResource } from "@/hooks/useApiResource";
import { RoleWithPermissions } from "@/types";

export function useManageRoles() {
  return useApiResource<RoleWithPermissions>("admin/roles", ["roles"]);
}