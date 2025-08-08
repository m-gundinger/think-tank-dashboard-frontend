import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus } from "@/types";

const statusMap: Record<TaskStatus, { text: string; dot: string }> = {
  [TaskStatus.IN_PROGRESS]: {
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  [TaskStatus.TODO]: {
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
  [TaskStatus.IN_REVIEW]: {
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  [TaskStatus.DONE]: {
    text: "text-green-400",
    dot: "bg-green-400",
  },
  [TaskStatus.BLOCKED]: {
    text: "text-red-400",
    dot: "bg-red-400",
  },
  [TaskStatus.CANCELLED]: {
    text: "text-gray-400",
    dot: "bg-gray-400",
  },
};

interface StatusCellProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function StatusCell({ task, onUpdate }: StatusCellProps) {
  const config = statusMap[task.status];

  const handleUpdate = (newStatus: TaskStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <Select
      defaultValue={task.status}
      onValueChange={(val) => handleUpdate(val as TaskStatus)}
    >
      <SelectTrigger
        className="h-auto border-none bg-transparent p-0 hover:bg-transparent focus:bg-transparent focus:ring-0 [&>svg]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue asChild>
          <div
            className={`status-pill inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config?.text}`}
          >
            <span className={`mr-2 h-2 w-2 ${config?.dot} rounded-full`}></span>
            {task.status.replace(/_/g, " ")}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="bg-element"
        onClick={(e) => e.stopPropagation()}
      >
        {Object.values(TaskStatus).map((s) => (
          <SelectItem key={s} value={s}>
            <div className="flex items-center">
              <span
                className={`mr-2 h-2 w-2 ${statusMap[s].dot} rounded-full`}
              ></span>
              {s.replace(/_/g, " ")}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}