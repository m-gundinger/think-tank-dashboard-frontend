import { useState } from "react";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  AssigneeCell,
  DueDateCell,
  PriorityCell,
  StatusCell,
  ActionsCell,
  TaskTypeCell,
} from "./cells";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/api";

interface TaskRowProps {
  task: Task;
  level?: number;
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  showWorkspace: boolean;
  showProject: boolean;
  showTaskType: boolean;
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

export function TaskRow({
  task,
  level = 0,
  onTaskSelect,
  onTaskUpdate,
  showWorkspace,
  showProject,
  showTaskType,
  selectedTaskIds,
  setSelectedTaskIds,
}: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const isCompleted = task.status === TaskStatus.DONE;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelectionToggle = (checked: boolean) => {
    setSelectedTaskIds(
      checked
        ? [...selectedTaskIds, task.id]
        : selectedTaskIds.filter((id) => id !== task.id)
    );
  };

  let nameSpan = 4;
  if (!showWorkspace) nameSpan++;
  if (!showProject) nameSpan++;
  if (!showTaskType) nameSpan++;

  return (
    <div
      data-task-id={task.id}
      className={cn("task-wrapper", isCompleted && "task-completed")}
    >
      <div
        className={cn(
          "task-row hover:bg-hover grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors duration-150"
        )}
        onClick={() => onTaskSelect(task.id)}
      >
        <div
          className={`col-span-12 sm:col-span-${nameSpan} flex items-center`}
          style={{ paddingLeft: `${level * 24}px` }}
        >
          <Checkbox
            className="task-checkbox mr-3 h-4 w-4 cursor-pointer rounded border-border bg-element text-primary focus:ring-primary"
            checked={selectedTaskIds.includes(task.id)}
            onCheckedChange={handleSelectionToggle}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mr-1 w-6">
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="icon"
                className="subtask-toggle-btn hover:bg-hover h-6 w-6 rounded-md p-1"
                onClick={handleToggleExpand}
              >
                {isExpanded ? (
                  <ChevronDown className="subtask-icon h-4 w-4" />
                ) : (
                  <ChevronRight className="subtask-icon h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <span className="flex-1 truncate">{task.title}</span>
        </div>

        {showWorkspace && (
          <div className="col-span-1 hidden truncate text-sm sm:block">
            {task.workspaceName}
          </div>
        )}
        {showProject && (
          <div className="col-span-1 hidden truncate text-sm sm:block">
            {task.projectName}
          </div>
        )}
        {showTaskType && (
          <div className="col-span-1 hidden truncate text-sm sm:block">
            <TaskTypeCell task={task} onUpdate={onTaskUpdate} />
          </div>
        )}
        <div className="col-span-1 hidden sm:block">
          <AssigneeCell task={task} />
        </div>
        <div className="col-span-1 hidden text-sm sm:block">
          <DueDateCell task={task} onUpdate={onTaskUpdate} />
        </div>
        <div className="col-span-1 hidden sm:block">
          <PriorityCell task={task} onUpdate={onTaskUpdate} />
        </div>
        <div className="relative col-span-1 hidden sm:block">
          <StatusCell task={task} onUpdate={onTaskUpdate} />
        </div>
        <div className="col-span-1 hidden text-right sm:block">
          <ActionsCell task={task} onTaskSelect={onTaskSelect} />
        </div>
      </div>
      {hasSubtasks && isExpanded && (
        <div className="subtasks-container">
          {task.subtasks.map((sub) => (
            <TaskRow
              key={sub.id}
              task={sub}
              level={level + 1}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              showWorkspace={showWorkspace}
              showProject={showProject}
              showTaskType={showTaskType}
              selectedTaskIds={selectedTaskIds}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
