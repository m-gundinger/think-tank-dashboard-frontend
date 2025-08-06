import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
  SortingState,
  OnChangeFn,
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
import { Task } from "@/types";
import { TaskStatus, TaskPriority } from "@/types/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { useUpdateTask } from "../api/useUpdateTask";
import { useManageTasks } from "../api/useManageTasks";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

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
  workspaceId?: string | null;
  projectId?: string | null;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
}

export function TaskList({
  tasks,
  onTaskSelect,
  pagination,
  emptyState,
  workspaceId,
  projectId,
  sorting,
  setSorting,
}: TaskListProps) {
  const { useDelete } = useManageTasks(workspaceId, projectId);
  const deleteMutation = useDelete();
  const updateTaskMutation = useUpdateTask();

  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-medium hover:underline"
          onClick={() => onTaskSelect(row.original.id)}
        >
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "workspaceName",
      header: "Workspace",
      cell: ({ row }) => row.original.workspaceName,
      enableSorting: true,
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => row.original.projectName,
      enableSorting: true,
    },
    {
      accessorKey: "taskTypeName",
      header: "Type",
      cell: ({ row }) => row.original.taskType?.name,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.status}
          onValueChange={(newStatus) =>
            updateTaskMutation.mutate({
              taskId: row.original.id,
              workspaceId: row.original.workspaceId,
              projectId: row.original.projectId,
              taskData: { status: newStatus as TaskStatus },
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
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.priority}
          onValueChange={(newPriority) =>
            updateTaskMutation.mutate({
              taskId: row.original.id,
              workspaceId: row.original.workspaceId,
              projectId: row.original.projectId,
              taskData: { priority: newPriority as TaskPriority },
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
      cell: ({ row }) =>
        row.original.dueDate
          ? format(new Date(row.original.dueDate), "PPP")
          : "None",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onTaskSelect(row.original.id)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>View / Edit Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    row.original.shortId || row.original.id
                  );
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
                  if (window.confirm(`Delete task: "${row.original.title}"?`)) {
                    deleteMutation.mutate(row.original.id);
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

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // We need to pass the instance to DataTable, so we manage it here
  });

  return (
    <DataTableWrapper>
      <DataTable
        columns={columns}
        data={tasks}
        pagination={pagination}
        sorting={sorting}
        setSorting={setSorting}
        bulkActions={(selectedIds) => (
          <Button
            variant="destructive"
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${selectedIds.length} selected tasks? This cannot be undone.`
                )
              ) {
                deleteMutation.mutate(selectedIds, {
                  onSuccess: () => {
                    table.resetRowSelection();
                  },
                });
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