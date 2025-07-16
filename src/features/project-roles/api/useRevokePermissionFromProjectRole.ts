import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function revokePermission({
  workspaceId,
  projectId,
  roleId,
  permissionId,
}: any) {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/roles/${roleId}/permissions/${permissionId}`
  );
}

export function useRevokePermissionFromProjectRole(
  workspaceId: string,
  projectId: string,
  roleId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissionId: string) =>
      revokePermission({ workspaceId, projectId, roleId, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectRoles", projectId] });
    },
  });
}
