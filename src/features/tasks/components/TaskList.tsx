import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { Task } from "@/types";
import { TaskStatus, TaskPriority } from "@/types/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  pagination?: {
    page: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
  };
  emptyState: React.ReactNode;
  apiUrl: string;
  queryKey: string[];
}

export function TaskList({
  tasks,
  onTaskSelect,
  pagination,
  emptyState,
  apiUrl,
  queryKey,
}: TaskListProps) {
  const taskResource = useApiResource(apiUrl, queryKey);
  const deleteMutation = taskResource.useDelete();
  const updateTaskMutation = taskResource.useUpdate();

  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "shortId",
      header: "ID",
      cell: (task) => <span className="font-mono text-xs">{task.shortId}</span>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: (task) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => onTaskSelect(task.id)}
        >
          {task.title}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (task) => (
        <Select
          defaultValue={task.status}
          onValueChange={(newStatus) =>
            updateTaskMutation.mutate({
              id: task.id,
              data: { status: newStatus },
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (task) => (
        <Select
          defaultValue={task.priority}
          onValueChange={(newPriority) =>
            updateTaskMutation.mutate({
              id: task.id,
              data: { priority: newPriority },
            })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Set priority" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskPriority).map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (task) =>
        task.dueDate ? format(new Date(task.dueDate), "PPP") : "None",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (task) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onTaskSelect(task.id)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>View / Edit Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(task.shortId || task.id);
                  toast.success("Task ID copied to clipboard.");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Task ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (window.confirm(`Delete task: "${task.title}"?`)) {
                    deleteMutation.mutate(task.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  return (
    <DataTableWrapper>
      <DataTable
        columns={columns}
        data={tasks}
        pagination={pagination}
        bulkActions={(selectedIds) => (
          <Button
            variant="destructive"
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${selectedIds.length} selected tasks? This cannot be undone.`
                )
              ) {
                deleteMutation.mutate(selectedIds);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedIds.length})
          </Button>
        )}
      />
    </DataTableWrapper>
  );
}