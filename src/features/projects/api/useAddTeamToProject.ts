// src/features/projects/api/useAddTeamToProject.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface AddTeamParams {
  workspaceId: string;
  projectId: string;
  teamId: string;
  roleId: string;
}

async function addTeamToProject(params: AddTeamParams): Promise<any> {
  const { workspaceId, projectId, teamId, roleId } = params;
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/members/team`,
    { teamId, roleId }
  );
  return data;
}

export function useAddTeamToProject(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, { teamId: string; roleId: string }>({
    mutationFn: ({ teamId, roleId }) =>
      addTeamToProject({ workspaceId, projectId, teamId, roleId }),
    onSuccess: (data) => {
      toast.success(`${data.count} member(s) added to the project.`);
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to add team to project", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
