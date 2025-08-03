import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function assignPermission({
  roleId,
  permissionId,
}: {
  roleId: string;
  permissionId: string;
}): Promise<any> {
  const { data } = await api.post(`admin/roles/${roleId}/permissions`, {
    permissionId,
  });
  return data;
}

export function useAssignPermissionToRole(roleId: string) {
  return useApiMutation({
    mutationFn: (permissionId: string) =>
      assignPermission({ roleId, permissionId }),
    successMessage: "Permission assigned to role.",
    invalidateQueries: [["roles"], ["role", roleId]],
  });
}