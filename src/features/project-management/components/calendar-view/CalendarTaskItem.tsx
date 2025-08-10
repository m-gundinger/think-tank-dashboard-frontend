import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useApiResource } from "@/hooks/useApiResource";
import { useParams } from "react-router-dom";
import { Task } from "@/types";
import { TaskPriority } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAbsoluteUrl } from "@/lib/utils";
import { ActionMenu } from "@/components/ui/ActionMenu";

const priorityBadgeConfig: Partial<
  Record<TaskPriority, { label: string; className: string }>
> = {
  [TaskPriority.URGENT]: {
    label: "Urgent",
    className: "bg-priority-urgent text-background border-priority-urgent",
  },
  [TaskPriority.HIGH]: {
    label: "High",
    className: "bg-priority-high text-background border-priority-high",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    className: "bg-priority-medium text-background border-priority-medium",
  },
  [TaskPriority.LOW]: {
    label: "Low",
    className: "bg-priority-low text-background border-priority-low",
  },
};

export function CalendarTaskItem({
  task,
  onTaskSelect,
}: {
  task: Task;
  onTaskSelect: (taskId: string) => void;
}) {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const deleteTaskMutation = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    ["tasks", projectId]
  ).useDelete();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskSelect(task.id);
  };

  const priorityConfig =
    task.priority && priorityBadgeConfig[task.priority]
      ? priorityBadgeConfig[task.priority]
      : null;

  const TaskTypeIcon = task.taskType?.icon ? getIcon(task.taskType.icon) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskSelect(task.id)}
      className={cn(isDragging && "dragging-card")}
    >
      <Card className="mb-2 cursor-grab border-border bg-element hover:bg-hover active:cursor-grabbing">
        <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
          <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
          <ActionMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            deleteDisabled={deleteTaskMutation.isPending}
          />
        </CardHeader>

        <CardContent className="flex flex-col gap-2 px-3 pb-2"></CardContent>

        <CardFooter className="flex items-center justify-between p-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {priorityConfig && (
              <Badge
                variant="outline"
                className={`text-xs ${priorityConfig.className}`}
              >
                {priorityConfig.label}
              </Badge>
            )}
            {task.taskType && (
              <Badge
                variant="outline"
                style={
                  task.taskType.color
                    ? {
                        backgroundColor: `${task.taskType.color}20`,
                        color: task.taskType.color,
                        borderColor: `${task.taskType.color}80`,
                      }
                    : {}
                }
              >
                {TaskTypeIcon && <TaskTypeIcon className="mr-1 h-3 w-3" />}
                {task.taskType.name}
              </Badge>
            )}
          </div>
          <div className="flex -space-x-2">
            {task.assignees?.map((assignee) => (
              <Avatar
                key={assignee.id}
                className="h-6 w-6 border-2 border-background"
              >
                <AvatarImage src={getAbsoluteUrl(assignee.avatarUrl)} />
                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}