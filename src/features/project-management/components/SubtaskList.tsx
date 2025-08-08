import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubtaskItem } from "./SubtaskItem";
import { useManageTasks } from "../api/useManageTasks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SubtaskListProps {
  task: any;
  onAddSubtask: () => void;
  onTaskSelect: (taskId: string) => void;
}

export function SubtaskList({
  task,
  onAddSubtask,
  onTaskSelect,
}: SubtaskListProps) {
  const queryClient = useQueryClient();
  const { useDelete } = useManageTasks(task.workspaceId, task.projectId);
  const deleteTaskMutation = useDelete();

  const handleRemoveSubtask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this sub-task?")) {
      deleteTaskMutation.mutate(taskId, {
        onSuccess: () => {
          toast.success("Sub-task deleted.");
          queryClient.invalidateQueries({ queryKey: ["task", task.id] });
        },
      });
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Sub-tasks</h3>
        <Button variant="ghost" size="sm" onClick={onAddSubtask}>
          <Plus className="mr-1 h-4 w-4" /> Add Sub-task
        </Button>
      </div>
      <div className="space-y-1 rounded-md border p-2">
        {task.subtasks?.length > 0 ? (
          task.subtasks.map((subtask: any) => (
            <SubtaskItem
              key={subtask.id}
              task={subtask}
              onTaskSelect={onTaskSelect}
              onRemove={handleRemoveSubtask}
              level={0}
            />
          ))
        ) : (
          <p className="p-2 text-center text-xs text-muted-foreground">
            No sub-tasks yet.
          </p>
        )}
      </div>
    </div>
  );
}