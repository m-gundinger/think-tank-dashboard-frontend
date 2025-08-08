import { useState } from "react";
import { Task } from "@/types";
import { TaskRow } from "./TaskRow";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskGroupProps {
  groupName: string;
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  showWorkspace: boolean;
  showProject: boolean;
  showTaskType: boolean;
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

export function TaskGroup({
  groupName,
  tasks,
  onTaskSelect,
  onTaskUpdate,
  showWorkspace,
  showProject,
  showTaskType,
  selectedTaskIds,
  setSelectedTaskIds,
}: TaskGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (tasks.length === 0) {
    return null;
  }
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="task-group">
      <div
        className={cn(
          "group-header sticky top-0 z-10 flex cursor-pointer items-center border-b border-border bg-element px-4 py-2 backdrop-blur-sm",
          isCollapsed && "group-collapsed"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronDown className="group-header-icon mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">{groupName}</h3>
        <span className="ml-2 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className={cn("group-tasks", isCollapsed && "hidden")}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              showWorkspace={showWorkspace}
              showProject={showProject}
              showTaskType={showTaskType}
              selectedTaskIds={selectedTaskIds}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}