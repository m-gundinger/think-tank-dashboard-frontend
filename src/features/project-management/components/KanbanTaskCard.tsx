import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Repeat,
  Briefcase,
} from "lucide-react";
import { useApiResource } from "@/hooks/useApiResource";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Task } from "@/types";
import { TaskPriority } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAbsoluteUrl } from "@/lib/utils";

const priorityBadgeConfig: Partial<
  Record<TaskPriority, { label: string; className: string }>
> = {
  [TaskPriority.URGENT]: {
    label: "Urgent",
    className:
      "bg-priority-urgent/20 text-priority-urgent border-priority-urgent/50",
  },
  [TaskPriority.HIGH]: {
    label: "High",
    className: "bg-priority-high/20 text-priority-high border-priority-high/50",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    className:
      "bg-priority-medium/20 text-priority-medium border-priority-medium/50",
  },
};

export function KanbanTaskCard({
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

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(task.shortId || task.id);
    toast.success("Task ID copied to clipboard.");
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
      <Card className="mb-2 cursor-grab border-slate-700 bg-kanban-card hover:bg-kanban-card-hover active:cursor-grabbing">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-0 pt-0">
          <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-slate-400 hover:bg-slate-700 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>View / Edit Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Task ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 px-3 pb-0 pt-0">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}
            {task.recurrenceRule && <Repeat className="h-3.5 w-3.5" />}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            {!projectId && task.projectName && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">
                  {task.workspaceName}/{task.projectName}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-3 pb-0 pt-0">
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
                className="h-6 w-6 border-2 border-kanban-bg"
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
