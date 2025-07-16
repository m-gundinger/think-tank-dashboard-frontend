import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workspaceId: string;
  workspaceData: any;
}

async function updateWorkspace({
  workspaceId,
  workspaceData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(`/workspaces/${workspaceId}`, workspaceData);
  return data;
}

export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (workspaceData) =>
      updateWorkspace({ workspaceId, workspaceData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
  });
}
