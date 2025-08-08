import { TaskPriority, Task } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityMap: Record<
  TaskPriority,
  { color: string; label: string } | undefined
> = {
  [TaskPriority.URGENT]: { color: "text-priority-urgent", label: "Urgent" },
  [TaskPriority.HIGH]: { color: "text-priority-high", label: "High" },
  [TaskPriority.MEDIUM]: { color: "text-priority-medium", label: "Medium" },
  [TaskPriority.LOW]: { color: "text-blue-500", label: "Low" },
  [TaskPriority.NONE]: { color: "text-muted-foreground", label: "None" },
};

interface PriorityCellProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function PriorityCell({ task, onUpdate }: PriorityCellProps) {
  const config = priorityMap[task.priority];

  const handleUpdate = (newPriority: TaskPriority) => {
    onUpdate(task.id, { priority: newPriority });
  };

  return (
    <Select
      defaultValue={task.priority}
      onValueChange={(val) => handleUpdate(val as TaskPriority)}
    >
      <SelectTrigger
        className="h-auto w-full border-none bg-transparent p-0 hover:bg-transparent focus:bg-transparent focus:ring-0 [&>svg]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue asChild>
          <div className="priority-flag flex items-center space-x-2 bg-transparent">
            {config && <Flag className={cn("h-4 w-4", config.color)} />}
            <span className="hidden lg:inline">{config?.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="bg-element"
        onClick={(e) => e.stopPropagation()}
      >
        {Object.values(TaskPriority).map((p) => (
          <SelectItem key={p} value={p}>
            <div className="flex items-center space-x-2">
              <Flag className={cn("h-4 w-4", priorityMap[p]?.color)} />
              <span>{priorityMap[p]?.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}