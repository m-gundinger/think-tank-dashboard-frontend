// src/features/views/components/KanbanTaskCard.tsx
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
} from "lucide-react";
import { useDeleteTask } from "@/features/tasks/api/useDeleteTask";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Task } from "@/features/tasks/task.types";
import { TaskStatus } from "@/types";

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id, data: { type: "Task", task } });
  const deleteTaskMutation = useDeleteTask(workspaceId!, projectId!);

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
    navigator.clipboard.writeText(task.id);
    toast.success("Task ID copied to clipboard.");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskSelect(task.id);
  };

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.status === TaskStatus.DONE).length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskSelect(task.id)}
    >
      <Card className="mb-2 cursor-grab active:cursor-grabbing">
        <CardHeader className="flex-row items-start justify-between p-3 pb-2">
          <CardTitle className="text-sm font-normal">{task.title}</CardTitle>
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
                <span>Edit Task</span>
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
        {(task.dueDate || totalSubtasks > 0) && (
          <CardContent className="flex items-center justify-between px-3 pb-2">
            {task.dueDate ? (
              <div className="text-muted-foreground flex items-center text-xs">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                <span>{format(new Date(task.dueDate), "PP")}</span>
              </div>
            ) : (
              <div />
            )}
            {totalSubtasks > 0 && (
              <div className="text-muted-foreground flex items-center text-xs">
                <CheckSquare className="mr-1 h-3.5 w-3.5" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
