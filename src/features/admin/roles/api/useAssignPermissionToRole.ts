import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function assignPermission({
  roleId,
  permissionId,
}: {
  roleId: string;
  permissionId: string;
}): Promise<any> {
  const { data } = await api.post(`/admin/roles/${roleId}/permissions`, {
    permissionId,
  });
  return data;
}

export function useAssignPermissionToRole(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionId: string) =>
      assignPermission({ roleId, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
    },
  });
}
