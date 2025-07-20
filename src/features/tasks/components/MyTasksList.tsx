// src/features/tasks/components/MyTasksList.tsx
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
import { useDeleteStandaloneTask } from "../api/useDeleteStandaloneTask";
import { Task } from "../task.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface MyTasksListProps {
  onTaskSelect: (taskId: string) => void;
  tasks: Task[];
  pagination: {
    page: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
  };
  isLoading: boolean;
  isError: boolean;
}

export function MyTasksList({
  onTaskSelect,
  tasks,
  pagination,
  isLoading,
  isError,
}: MyTasksListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const deleteMutation = useDeleteStandaloneTask();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tasks?.map((item: any) => item.id) || []);
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

  if (isLoading) return null; // Parent will show skeleton
  if (isError) return <div>Error loading tasks.</div>;

  const isAllSelected = tasks.length > 0 && selectedIds.length === tasks.length;

  const renderBody = () => {
    if (tasks.length === 0) {
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
    return tasks.map((task: Task) => (
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
          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.handlePageChange(pagination.page - 1);
                    }}
                    isActive={pagination.page > 1}
                  />
                </PaginationItem>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.handlePageChange(i + 1);
                      }}
                      isActive={pagination.page === i + 1}
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
                      pagination.handlePageChange(pagination.page + 1);
                    }}
                    isActive={pagination.page < pagination.totalPages}
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
