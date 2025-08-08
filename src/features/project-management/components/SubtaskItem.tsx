import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleSlash,
  Eye,
  OctagonAlert,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { TaskStatus } from "@/types/api";
import React from "react";
import { Task } from "@/types";

interface SubtaskItemProps {
  task: Task;
  onTaskSelect: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  level?: number;
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

export function SubtaskItem({
  task,
  onTaskSelect,
  onRemove,
  level = 0,
}: SubtaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onTaskSelect(task.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(task.id);
  };

  const Icon = statusIconMap[task.status] || Circle;
  const isStruckThrough =
    task.status === TaskStatus.CANCELLED || task.status === TaskStatus.DONE;

  return (
    <div className="flex flex-col">
      <div
        className="group flex cursor-pointer items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-hover"
        onClick={handleSelect}
        style={{ paddingLeft: `${level * 24}px` }}
      >
        <div className="flex w-6 items-center justify-center">
          {hasSubtasks ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleToggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
        </div>
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
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
      {hasSubtasks && isExpanded && (
        <div className="mt-1">
          {task.subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              task={subtask}
              onTaskSelect={onTaskSelect}
              onRemove={onRemove}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}