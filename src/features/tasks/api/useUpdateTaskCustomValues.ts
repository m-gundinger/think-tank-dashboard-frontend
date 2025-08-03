import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

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
    `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/custom-fields`,
    { updates }
  );
  return data;
}

export function useUpdateTaskCustomValues(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (updates: { fieldId: string; value: any }[]) =>
      updateTaskCustomValues({ workspaceId, projectId, taskId, updates }),
    invalidateQueries: [
      ["task", taskId],
      ["tasks", projectId],
    ],
  });
}