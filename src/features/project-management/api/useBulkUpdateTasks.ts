import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { BulkUpdateTasksDto } from "@/types";

async function bulkUpdateTasks(
  data: BulkUpdateTasksDto
): Promise<{ count: number }> {
  const response = await api.patch("/tasks/bulk", data);
  return response.data;
}

export function useBulkUpdateTasks(projectId?: string) {
  const queryKeysToInvalidate: (string | undefined)[][] = [["myTasks"]];
  if (projectId) {
    queryKeysToInvalidate.push(["tasks", projectId]);
  }

  return useApiMutation<
    { count: number },
    { taskIds: string[]; updates: BulkUpdateTasksDto["updates"] }
  >({
    mutationFn: (variables) =>
      bulkUpdateTasks({
        taskIds: variables.taskIds,
        updates: variables.updates,
      }),
    successMessage: (data) => `${data.count} tasks updated successfully.`,
    invalidateQueries: queryKeysToInvalidate,
  });
}