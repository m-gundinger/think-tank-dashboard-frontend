import { useApiResource } from "@/hooks/useApiResource";

export function useManagePermissions() {
  const resource = useApiResource("admin/permissions", ["permissions"]);
  return resource;
}