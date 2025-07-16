import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createProjectRole({ workspaceId, projectId, roleData }: any) {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    roleData
  );
  return data;
}

export function useCreateProjectRole(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleData: any) =>
      createProjectRole({ workspaceId, projectId, roleData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectRoles", projectId] });
    },
  });
}
