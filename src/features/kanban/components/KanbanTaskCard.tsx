import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { useDeleteTask } from "@/features/tasks/api/useDeleteTask";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function KanbanTaskCard({ task, onTaskSelect }: any) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskSelect(task.id)}
    >
      <Card className="mb-2 cursor-grab active:cursor-grabbing">
        <CardHeader className="flex-row items-start justify-between p-3">
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
      </Card>
    </div>
  );
}
