import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square } from "lucide-react";

interface SubtaskItemProps {
  task: any;
  onTaskSelect: (taskId: string) => void;
}

export function SubtaskItem({ task, onTaskSelect }: SubtaskItemProps) {
  const isCompleted = task.status === "DONE";

  const handleClick = () => {
    onTaskSelect(task.id);
  };

  return (
    <div
      className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md p-2"
      onClick={handleClick}
    >
      {isCompleted ? (
        <CheckSquare className="text-muted-foreground h-4 w-4" />
      ) : (
        <Square className="text-muted-foreground h-4 w-4" />
      )}
      <span className="flex-grow truncate text-sm">{task.title}</span>
      <Badge variant="outline" className="text-xs">
        {task.priority}
      </Badge>
    </div>
  );
}
