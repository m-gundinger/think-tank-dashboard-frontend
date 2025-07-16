import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/features/tasks/task.types";
import { TaskStatus } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface MoveTaskParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  targetColumnId: string;
  orderInColumn: number;
  newStatus?: TaskStatus | null;
}

interface MoveTaskContext {
  previousTasksData?: any;
}

async function moveTask(params: MoveTaskParams): Promise<any> {
  const { data } = await api.patch(
    `/workspaces/${params.workspaceId}/projects/${params.projectId}/tasks/${params.taskId}/move`,
    {
      targetColumnId: params.targetColumnId,
      orderInColumn: params.orderInColumn,
    }
  );
  return data;
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, MoveTaskParams, MoveTaskContext>({
    mutationFn: moveTask,

    onMutate: async (movedTask) => {
      const queryKey = ["tasks", movedTask.projectId, {}];
      await queryClient.cancelQueries({ queryKey });

      const previousTasksData = queryClient.getQueryData<any>(queryKey);

      queryClient.setQueryData<any>(queryKey, (oldData: any | undefined) => {
        if (!oldData || !oldData.data) return oldData;
        const updatedTasks = oldData.data.map((task: Task) =>
          task.id === movedTask.taskId
            ? {
                ...task,
                boardColumnId: movedTask.targetColumnId,
                status: movedTask.newStatus || task.status,
              }
            : task
        );
        return { ...oldData, data: updatedTasks };
      });

      return { previousTasksData };
    },

    onError: (_err, variables, context) => {
      if (context?.previousTasksData) {
        queryClient.setQueryData(
          ["tasks", variables.projectId, {}],
          context.previousTasksData
        );
      }
      toast.error("Failed to move task.");
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
  });
}
