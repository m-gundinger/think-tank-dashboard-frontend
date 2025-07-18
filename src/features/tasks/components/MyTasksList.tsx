import { useState } from "react";
import { TaskTableRow } from "./TaskTableRow";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckSquare, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetMyTasks } from "../api/useGetMyTasks";
import { useDeleteStandaloneTask } from "../api/useDeleteStandaloneTask";
import { Skeleton } from "@/components/ui/skeleton";
import { Task, ListTasksQuery } from "../task.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
interface MyTasksListProps {
  onTaskSelect: (taskId: string) => void;
  query: Partial<ListTasksQuery>;
}

const TaskListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-4 rounded-md border p-4"
      >
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);
export function MyTasksList({ onTaskSelect, query }: MyTasksListProps) {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetMyTasks({
    page,
    limit: 15,
    includeSubtasks: true,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...query,
  });
  const deleteMutation = useDeleteStandaloneTask();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data?.data?.map((item: any) => item.id) || []);
    } else {
      setSelectedIds([]);
    }
  };
  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };
  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Delete ${selectedIds.length} selected tasks? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(selectedIds, {
        onSuccess: () => setSelectedIds([]),
      });
    }
  };

  if (isLoading) return <TaskListSkeleton />;
  if (isError) return <div>Error loading tasks.</div>;
  const isAllSelected =
    data?.data?.length > 0 && selectedIds.length === data.data.length;
  const renderBody = () => {
    if (data?.data?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <EmptyState
              icon={<CheckSquare className="text-primary h-10 w-10" />}
              title="No tasks here"
              description="No tasks match your current filter. Try selecting a different filter or create a new task."
            />
          </TableCell>
        </TableRow>
      );
    }
    return data?.data.map((task: Task) => (
      <TaskTableRow
        key={task.id}
        task={task}
        onTaskSelect={onTaskSelect}
        level={0}
        isSelected={selectedIds.includes(task.id)}
        onSelectChange={handleRowSelect}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderBody()}</TableBody>
        </Table>
        <CardFooter className="border-t pt-4">
          {data?.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    isActive={page > 1}
                  />
                </PaginationItem>
                {[...Array(data.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    isActive={page < data.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
