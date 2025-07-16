import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface AddMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
  roleId: string;
}

async function addProjectMember(params: AddMemberParams): Promise<any> {
  const { workspaceId, projectId, userId, roleId } = params;
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/members`,
    { userId, roleId }
  );
  return data;
}

export function useAddProjectMember(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, { userId: string; roleId: string }>({
    mutationFn: ({ userId, roleId }) =>
      addProjectMember({ workspaceId, projectId, userId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
  });
}
