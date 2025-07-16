import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubtaskItem } from "./SubtaskItem";

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
            />
          ))
        ) : (
          <p className="text-muted-foreground p-2 text-center text-xs">
            No sub-tasks yet.
          </p>
        )}
      </div>
    </div>
  );
}
