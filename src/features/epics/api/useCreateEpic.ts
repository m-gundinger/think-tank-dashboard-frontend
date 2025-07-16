import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createEpic({
  workspaceId,
  projectId,
  epicData,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`,
    epicData
  );
  return data;
}

export function useCreateEpic(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: (epicData) => createEpic({ workspaceId, projectId, epicData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epics", projectId] });
    },
  });
}
