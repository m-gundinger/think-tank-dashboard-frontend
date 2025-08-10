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
  TaskTypeCell,
} from "./cells";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { useManageTasks } from "../../api/useManageTasks";

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

  const { useDelete } = useManageTasks(task.workspaceId, task.projectId);
  const deleteMutation = useDelete();

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
  };

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteMutation.mutate(task.id);
    }
  };

  return (
    <div
      ref={setDraggableNodeRef}
      style={style}
      data-task-id={task.id}
      className={cn(
        "task-wrapper group/task-row",
        isCompleted && "task-completed"
      )}
    >
      <div
        ref={setDroppableNodeRef}
        className={cn(
          "task-row grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors duration-150 hover:bg-hover",
          isOver && "bg-primary/20"
        )}
        onClick={() => onTaskSelect(task.id)}
      >
        <div
          className="col-span-4 flex items-center"
          style={{ paddingLeft: `${level * 24}px` }}
        >
          <span
            className="task-drag-handle mr-1 cursor-grab touch-none p-1 text-muted-foreground opacity-0 group-hover/task-row:opacity-100"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            {/* :: */}
          </span>
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
                className="subtask-toggle-btn h-6 w-6 rounded-md p-1 hover:bg-hover"
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
        <div className="col-span-1 text-right">
          <div className="opacity-0 group-hover/task-row:opacity-100">
            <ActionMenu
              onEdit={() => onTaskSelect(task.id)}
              onDelete={handleDelete}
            />
          </div>
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