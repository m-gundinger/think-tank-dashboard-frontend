import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteProjectRole({ workspaceId, projectId, roleId }: any) {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/roles/${roleId}`
  );
}

export function useDeleteProjectRole(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) =>
      deleteProjectRole({ workspaceId, projectId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectRoles", projectId] });
    },
  });
}
