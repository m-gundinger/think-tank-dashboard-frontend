// FILE: src/features/tasks/components/MyTasksList.tsx

import { useState } from "react";
import { TaskTableRow } from "./TaskTableRow";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckSquare } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "../task.types";

interface MyTasksListProps {
  onTaskSelect: (taskId: string) => void;
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

export function MyTasksList({ onTaskSelect }: MyTasksListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetMyTasks({
    page,
    limit: 15,
    sortBy: "createdAt",
    sortOrder: "desc",
    includeSubtasks: false,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) return <TaskListSkeleton />;
  if (isError) return <div>Error loading tasks.</div>;

  const renderBody = () => {
    if (data?.data?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <EmptyState
              icon={<CheckSquare className="text-primary h-10 w-10" />}
              title="No tasks here"
              description="You have no tasks assigned to you or created by you. Create one to get started."
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
      />
    ));
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
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
  );
}
