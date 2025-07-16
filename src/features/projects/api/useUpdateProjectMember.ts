import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
  roleId: string;
}

async function updateProjectMember(params: UpdateMemberParams): Promise<any> {
  const { workspaceId, projectId, userId, roleId } = params;
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`,
    { roleId }
  );
  return data;
}

export function useUpdateProjectMember(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, { userId: string; roleId: string }>({
    mutationFn: ({ userId, roleId }) =>
      updateProjectMember({ workspaceId, projectId, userId, roleId }),
    onSuccess: () => {
      toast.success("Project member's role has been updated.");
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update role", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
