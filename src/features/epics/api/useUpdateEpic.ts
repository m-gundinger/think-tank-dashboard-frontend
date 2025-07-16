import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workspaceId: string;
  projectId: string;
  epicId: string;
  epicData: any;
}

async function updateEpic({
  workspaceId,
  projectId,
  epicId,
  epicData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/epics/${epicId}`,
    epicData
  );
  return data;
}

export function useUpdateEpic(
  workspaceId: string,
  projectId: string,
  epicId: string
) {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: (epicData) =>
      updateEpic({ workspaceId, projectId, epicId, epicData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epics", projectId] });
    },
  });
}
