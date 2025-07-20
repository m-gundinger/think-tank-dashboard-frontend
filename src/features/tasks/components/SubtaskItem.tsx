// src/features/tasks/components/SubtaskItem.tsx
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleSlash,
  Eye,
  OctagonAlert,
} from "lucide-react";
import { TaskStatus } from "@/types";
import React from "react";
import { Task } from "../task.types";

interface SubtaskItemProps {
  task: Task;
  onTaskSelect: (taskId: string) => void;
}

const statusIconMap: Record<TaskStatus, React.ElementType> = {
  [TaskStatus.TODO]: Circle,
  [TaskStatus.IN_PROGRESS]: CircleDashed,
  [TaskStatus.IN_REVIEW]: Eye,
  [TaskStatus.DONE]: CheckCircle2,
  [TaskStatus.BLOCKED]: OctagonAlert,
  [TaskStatus.CANCELLED]: CircleSlash,
};

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "text-gray-500",
  [TaskStatus.IN_PROGRESS]: "text-blue-500",
  [TaskStatus.IN_REVIEW]: "text-purple-500",
  [TaskStatus.DONE]: "text-green-500",
  [TaskStatus.BLOCKED]: "text-red-500",
  [TaskStatus.CANCELLED]: "text-gray-400",
};

export function SubtaskItem({ task, onTaskSelect }: SubtaskItemProps) {
  const handleClick = () => {
    onTaskSelect(task.id);
  };
  const Icon = statusIconMap[task.status] || Circle;
  const isStruckThrough =
    task.status === TaskStatus.CANCELLED || task.status === TaskStatus.DONE;

  return (
    <div
      className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md p-2"
      onClick={handleClick}
    >
      <Icon
        className={`h-4 w-4 flex-shrink-0 ${statusColorMap[task.status]}`}
      />
      <span
        className={`flex-grow truncate text-sm ${
          isStruckThrough ? "text-muted-foreground line-through" : ""
        }`}
      >
        {task.title}
      </span>
      <Badge variant="outline" className="text-xs">
        {task.priority}
      </Badge>
    </div>
  );
}
