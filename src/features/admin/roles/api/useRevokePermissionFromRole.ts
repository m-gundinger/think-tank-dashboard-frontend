import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function revokePermission({
  roleId,
  permissionId,
}: {
  roleId: string;
  permissionId: string;
}): Promise<any> {
  const { data } = await api.delete(
    `/admin/roles/${roleId}/permissions/${permissionId}`
  );
  return data;
}

export function useRevokePermissionFromRole(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionId: string) =>
      revokePermission({ roleId, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
    },
  });
}
