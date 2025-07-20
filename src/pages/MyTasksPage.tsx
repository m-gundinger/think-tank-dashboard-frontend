// src/pages/MyTasksPage.tsx
import { MyTasksList } from "@/features/tasks/components/MyTasksList";
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog";
import { TaskDetailModal } from "@/features/tasks/components/TaskDetailModal";
import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ListTasksQuery } from "@/features/tasks/task.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasks } from "@/features/tasks/api/useGetMyTasks";
import { MyTasksKanbanBoard } from "@/features/tasks/components/MyTasksKanbanBoard";
import { Skeleton } from "@/components/ui/skeleton";

const TaskListSkeleton = () => (
  <div className="space-y-2 pt-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);

export function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");
  const activeView = searchParams.get("view") || "list";

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all_assigned");
  const [sortBy, setSortBy] = useState("priority");

  const handleTaskSelect = (taskId: string | null) => {
    setSearchParams(
      (params) => {
        if (taskId) {
          params.set("taskId", taskId);
        } else {
          params.delete("taskId");
        }
        return params;
      },
      { replace: true }
    );
  };

  const handleViewChange = (view: string) => {
    setSearchParams(
      (params) => {
        params.set("view", view);
        return params;
      },
      { replace: true }
    );
  };

  const queryParams: ListTasksQuery = useMemo(() => {
    const baseQuery = {
      sortBy: sortBy as ListTasksQuery["sortBy"],
      sortOrder: "desc" as const,
      limit: activeView === "kanban" ? 200 : 15,
      page: page,
      includeSubtasks: true,
    };

    switch (filter) {
      case "created_standalone":
        return { ...baseQuery, userRole: "creator", taskOrigin: "standalone" };
      case "created_project":
        return { ...baseQuery, userRole: "creator", taskOrigin: "project" };
      case "assigned_standalone":
        return { ...baseQuery, userRole: "assignee", taskOrigin: "standalone" };
      case "assigned_project":
        return { ...baseQuery, userRole: "assignee", taskOrigin: "project" };
      case "all_assigned":
        return { ...baseQuery, userRole: "assignee" };
      default:
        return baseQuery;
    }
  }, [filter, sortBy, activeView, page]);

  const { data, isLoading, isError } = useGetMyTasks(queryParams);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground">
              All tasks assigned to you or created by you.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="filter">Filter by</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter" className="w-[240px]">
                  <SelectValue placeholder="Filter tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All My Tasks</SelectItem>
                  <SelectItem value="all_assigned">
                    All Assigned to Me (Default)
                  </SelectItem>
                  <SelectItem value="assigned_project">
                    Assigned to Me (from Projects)
                  </SelectItem>
                  <SelectItem value="assigned_standalone">
                    Assigned to Me (Standalone)
                  </SelectItem>
                  <SelectItem value="created_project">
                    Created by Me (in Projects)
                  </SelectItem>
                  <SelectItem value="created_standalone">
                    Created by Me (Standalone)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {activeView === "list" && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-[180px]">
                    <SelectValue placeholder="Sort tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="createdAt">Creation Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="self-end">
              <CreateTaskDialog />
            </div>
          </div>
        </div>
        <Tabs value={activeView} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            {isLoading ? (
              <TaskListSkeleton />
            ) : (
              <MyTasksList
                onTaskSelect={handleTaskSelect}
                tasks={data?.data || []}
                isLoading={isLoading}
                isError={isError}
                pagination={{
                  page: data?.page || 1,
                  totalPages: data?.totalPages || 1,
                  handlePageChange,
                }}
              />
            )}
          </TabsContent>
          <TabsContent value="kanban" className="mt-4">
            {isLoading ? (
              <TaskListSkeleton />
            ) : (
              <MyTasksKanbanBoard
                tasks={data?.data || []}
                onTaskSelect={handleTaskSelect}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleTaskSelect(null);
        }}
        onTaskSelect={handleTaskSelect}
      />
    </>
  );
}
