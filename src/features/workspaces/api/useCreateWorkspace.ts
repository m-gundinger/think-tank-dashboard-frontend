import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createWorkspace(newWorkspace: any): Promise<any> {
  const { data } = await api.post("/workspaces", newWorkspace);
  return data;
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
