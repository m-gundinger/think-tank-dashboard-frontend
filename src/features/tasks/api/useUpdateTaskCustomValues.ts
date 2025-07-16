import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateValuesParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  updates: { fieldId: string; value: any }[];
}

async function updateTaskCustomValues({
  workspaceId,
  projectId,
  taskId,
  updates,
}: UpdateValuesParams): Promise<any> {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/custom-fields`,
    { updates }
  );
  return data;
}

export function useUpdateTaskCustomValues(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { fieldId: string; value: any }[]) =>
      updateTaskCustomValues({ workspaceId, projectId, taskId, updates }),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["task", taskId], updatedTask);

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
