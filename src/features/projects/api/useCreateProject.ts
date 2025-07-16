import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createProject({ workspaceId, projectData }: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects`,
    projectData
  );
  return data;
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (projectData) => createProject({ workspaceId, projectData }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
