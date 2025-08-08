import { Task } from "@/types";
import { TaskTypeSelector } from "../../TaskTypeSelector";

interface TaskTypeCellProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskTypeCell({ task, onUpdate }: TaskTypeCellProps) {
  const handleUpdate = (newTypeId: string | null) => {
    onUpdate(task.id, { taskTypeId: newTypeId });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <TaskTypeSelector
        workspaceId={task.workspaceId}
        projectId={task.projectId}
        value={task.taskTypeId ?? null}
        onValueChange={handleUpdate}
      />
    </div>
  );
}
