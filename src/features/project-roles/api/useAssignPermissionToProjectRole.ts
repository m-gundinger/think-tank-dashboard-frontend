import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function assignPermission({
  workspaceId,
  projectId,
  roleId,
  permissionId,
}: any) {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/roles/${roleId}/permissions`,
    { permissionId }
  );
  return data;
}

export function useAssignPermissionToProjectRole(
  workspaceId: string,
  projectId: string,
  roleId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissionId: string) =>
      assignPermission({ workspaceId, projectId, roleId, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectRoles", projectId] });
    },
  });
}
