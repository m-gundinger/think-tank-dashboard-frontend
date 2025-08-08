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
import { useManageTasks } from "@/features/project-management/api/useManageTasks";
import { toast } from "sonner";
import { Task } from "@/types";

interface ActionsCellProps {
  task: Task;
  onTaskSelect: (taskId: string) => void;
}

export function ActionsCell({ task, onTaskSelect }: ActionsCellProps) {
  const { useDelete } = useManageTasks(task.workspaceId, task.projectId);
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteMutation.mutate(task.id);
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

  return (
    <div className="text-right" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover-action h-8 w-8 rounded-md p-1 text-muted-foreground opacity-0 hover:bg-hover"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
}