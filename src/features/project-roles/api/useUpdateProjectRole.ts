import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateProjectRole({
  workspaceId,
  projectId,
  roleId,
  roleData,
}: any) {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/roles/${roleId}`,
    roleData
  );
  return data;
}

export function useUpdateProjectRole(
  workspaceId: string,
  projectId: string,
  roleId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleData: any) =>
      updateProjectRole({ workspaceId, projectId, roleId, roleData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectRoles", projectId] });
    },
  });
}
