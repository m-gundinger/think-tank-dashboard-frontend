import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workspaceId: string;
  projectId: string;
  projectData: any;
}

async function updateProject({
  workspaceId,
  projectId,
  projectData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}`,
    projectData
  );
  return data;
}

export function useUpdateProject(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (projectData) =>
      updateProject({ workspaceId, projectId, projectData }),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      queryClient.setQueryData(["project", projectId], updatedProject);
    },
  });
}
