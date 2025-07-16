import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createWorkflow(workflowData: any): Promise<any> {
  const { data } = await api.post("/admin/workflows", workflowData);
  return data;
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: createWorkflow,
    onSuccess: (newWorkflow) => {
      queryClient.setQueryData<any>(["workflows"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [newWorkflow, ...oldData.data],
          total: oldData.total + 1,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
