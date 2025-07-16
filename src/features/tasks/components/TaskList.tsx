import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardFooter } from "@/components/ui/card";
import { TaskTableRow } from "./TaskTableRow";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { CheckSquare } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Task } from "../task.types";

export function TaskList({
  workspaceId,
  projectId,
  tasks,
  onTaskSelect,
}: {
  workspaceId: string;
  projectId: string;
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}) {
  const [page, setPage] = useState(1);
  const limit = 15;
  const totalPages = Math.ceil(tasks.length / limit);
  const paginatedTasks = tasks.slice((page - 1) * limit, page * limit);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderBody = () => {
    if (tasks.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <EmptyState
              icon={<CheckSquare className="text-primary h-10 w-10" />}
              title="No tasks yet"
              description="Create the first task in this project to get started."
              action={
                <CreateTaskDialog
                  workspaceId={workspaceId}
                  projectId={projectId}
                />
              }
            />
          </TableCell>
        </TableRow>
      );
    }
    return paginatedTasks.map((task: any) => (
      <TaskTableRow
        key={task.id}
        task={task}
        workspaceId={workspaceId}
        projectId={projectId}
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
        {totalPages > 1 && (
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
              {[...Array(totalPages)].map((_, i) => (
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
                  isActive={page < totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardFooter>
    </Card>
  );
}
