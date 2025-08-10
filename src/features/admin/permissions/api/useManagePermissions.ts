import { useApiResource } from "@/hooks/useApiResource";
import { Permission } from "@/types";

interface PermissionQuery {
  page?: number;
}

export function useManagePermissions() {
  return useApiResource<Permission, PermissionQuery>("admin/permissions", [
    "permissions",
  ]);
}