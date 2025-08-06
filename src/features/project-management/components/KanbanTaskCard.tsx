import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  CheckSquare,
  ClipboardPlus,
  Repeat,
  Briefcase,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { useApiResource } from "@/hooks/useApiResource";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Task } from "@/types";
import { TaskStatus, TaskPriority } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTemplateFromTaskForm } from "@/features/project-management/components/CreateTemplateFromTaskForm";
import { getIcon } from "@/lib/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const priorityColorMap: Record<TaskPriority, string> = {
  [TaskPriority.URGENT]: "border-red-500",
  [TaskPriority.HIGH]: "border-orange-500",
  [TaskPriority.MEDIUM]: "border-yellow-500",
  [TaskPriority.LOW]: "border-blue-500",
  [TaskPriority.NONE]: "border-transparent",
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
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
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
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
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

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.status === TaskStatus.DONE).length || 0;

  const subtaskProgress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const TaskTypeIcon = task.taskType?.icon ? getIcon(task.taskType.icon) : null;
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => onTaskSelect(task.id)}
      >
        <Card
          className={`mb-2 cursor-grab border-l-4 bg-white active:cursor-grabbing ${
            priorityColorMap[task.priority]
          }`}
        >
          <CardHeader className="flex-row items-start justify-between p-3 pb-2">
            <div className="flex min-w-0 flex-col gap-2">
              {task.taskType && (
                <Badge
                  variant="outline"
                  className="w-fit"
                  style={
                    task.taskType.color
                      ? {
                          backgroundColor: `${task.taskType.color}1A`,
                          borderColor: task.taskType.color,
                          color: task.taskType.color,
                        }
                      : {}
                  }
                >
                  {TaskTypeIcon && <TaskTypeIcon className="mr-1 h-3 w-3" />}
                  {task.taskType.name}
                </Badge>
              )}
              <CardTitle className="text-sm font-normal">
                {task.title}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
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
                <DropdownMenuItem onClick={() => setIsTemplateDialogOpen(true)}>
                  <ClipboardPlus className="mr-2 h-4 w-4" />
                  <span>Save as Template</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyId}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Task ID</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-3 pb-3">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <p>{task.shortId}</p>
              {!projectId && task.projectName && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span className="truncate">
                    {task.workspaceName} / {task.projectName}
                  </span>
                </div>
              )}
            </div>

            {(task.dueDate || totalSubtasks > 0 || task.storyPoints) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {task.dueDate && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(task.dueDate), "MMM d")}</span>
                    </div>
                  )}
                  {task.storyPoints != null && (
                    <Badge variant="outline">SP: {task.storyPoints}</Badge>
                  )}
                  {task.recurrenceRule && (
                    <Repeat className="text-muted-foreground h-3.5 w-3.5" />
                  )}
                </div>
                {totalSubtasks > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>
                      {completedSubtasks}/{totalSubtasks}
                    </span>
                  </div>
                )}
              </div>
            )}
            {totalSubtasks > 0 && (
              <Progress value={subtaskProgress} className="h-1" />
            )}
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                {task._count && task._count.comments > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{task._count.comments}</span>
                  </div>
                )}
                {task._count && task._count.documents > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{task._count.documents}</span>
                  </div>
                )}
              </div>
              {task.assignees && task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee) => (
                    <Avatar
                      key={assignee.id}
                      className="h-6 w-6 border-2 border-white"
                    >
                      <AvatarImage src={getAbsoluteUrl(assignee.avatarUrl)} />
                      <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ResourceCrudDialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        title="Save Task as Template"
        description="This will create a new template based on the current task's properties."
        form={CreateTemplateFromTaskForm}
        formProps={{ workspaceId, projectId, task }}
        resourcePath={""}
        resourceKey={[]}
      />
    </>
  );
}