import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function revokePermission({
  roleId,
  permissionId,
}: {
  roleId: string;
  permissionId: string;
}): Promise<any> {
  const { data } = await api.delete(
    `admin/roles/${roleId}/permissions/${permissionId}`
  );
  return data;
}

export function useRevokePermissionFromRole(roleId: string) {
  return useApiMutation({
    mutationFn: (permissionId: string) =>
      revokePermission({ roleId, permissionId }),
    successMessage: "Permission revoked from role.",
    invalidateQueries: [["roles"], ["role", roleId]],
  });
}