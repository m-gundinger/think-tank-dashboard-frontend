import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workflowId: string;
  data: any;
}

async function updateWorkflow({
  workflowId,
  data,
}: UpdateParams): Promise<any> {
  const response = await api.put(`/admin/workflows/${workflowId}`, data);
  return response.data;
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, UpdateParams>({
    mutationFn: updateWorkflow,
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(
        ["workflow", updatedWorkflow.id],
        updatedWorkflow
      );

      queryClient.setQueryData<any>(["workflows"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((w: any) =>
            w.id === updatedWorkflow.id ? updatedWorkflow : w
          ),
        };
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({
        queryKey: ["workflow", variables.workflowId],
      });
    },
  });
}
