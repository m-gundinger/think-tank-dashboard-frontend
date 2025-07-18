import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

async function moveTask(params: MoveTaskParams): Promise<any> {
  const { data } = await api.patch(
    `/workspaces/${params.workspaceId}/projects/${params.projectId}/tasks/${params.taskId}/move`,
    {
      targetColumnId: params.targetColumnId,
      orderInColumn: params.orderInColumn,
      newStatus: params.newStatus,
    }
  );
  return data;
}

export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, MoveTaskParams>({
    mutationFn: moveTask,
    onSuccess: () => {},
    onError: () => {
      toast.error("Failed to move task.");
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tasks"],
      });
    },
  });
}