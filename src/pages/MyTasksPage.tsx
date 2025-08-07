import { TaskList } from "@/features/project-management/components/TaskList";
import { TaskDetailModal } from "@/features/project-management/components/TaskDetailModal";
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
import { ListTasksQuery, Task, ViewColumn } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyTasksKanbanBoard } from "@/features/project-management/components/MyTasksKanbanBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckSquare, PlusCircle, Filter, Columns } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "@/features/project-management/components/CreateTaskForm";
import { useGetMyTasks } from "@/features/project-management/api/useGetMyTasks";
import { CalendarView } from "@/features/project-management/components/CalendarView";
import { GanttChartView } from "@/features/project-management/components/GanttChartView";
import { SortingState } from "@tanstack/react-table";
import { useUpdateTask } from "@/features/project-management/api/useUpdateTask";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatus } from "@/types/api";

const TaskListSkeleton = () => (
  <div className="space-y-2 pt-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);

const KANBAN_COLUMNS: Omit<ViewColumn, "createdAt" | "updatedAt">[] = [
  {
    id: "col-todo",
    name: "To Do",
    order: 1,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-progress",
    name: "In Progress",
    order: 2,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-review",
    name: "In Review",
    order: 3,
    viewId: "my-tasks-view",
  },
  {
    id: "col-done",
    name: "Done",
    order: 4,
    viewId: "my-tasks-view",
  },
  {
    id: "col-blocked",
    name: "Blocked",
    order: 5,
    viewId: "my-tasks-view",
  },
  {
    id: "col-cancelled",
    name: "Cancelled",
    order: 6,
    viewId: "my-tasks-view",
  },
];

const columnStatusMap: Record<string, TaskStatus> = {
  "col-todo": TaskStatus.TODO,
  "col-in-progress": TaskStatus.IN_PROGRESS,
  "col-in-review": TaskStatus.IN_REVIEW,
  "col-done": TaskStatus.DONE,
  "col-blocked": TaskStatus.BLOCKED,
  "col-cancelled": TaskStatus.CANCELLED,
};

export function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");
  const activeView = searchParams.get("view") || "list";
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all_assigned");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "priority", desc: true },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>([
    "col-todo",
    "col-in-progress",
    "col-in-review",
    "col-done",
  ]);
  const updateTaskMutation = useUpdateTask();

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
    const baseQuery: ListTasksQuery = {
      sortBy: (sorting[0]?.id as ListTasksQuery["sortBy"]) ?? "priority",
      sortOrder: sorting[0]?.desc ? "desc" : "asc",
      limit: activeView === "list" ? 15 : 200,
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
  }, [filter, sorting, activeView, page]);

  const { data, isLoading } = useGetMyTasks(queryParams);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({
      taskId,
      taskData: updates,
    });
  };

  const visibleColumns = useMemo(
    () => KANBAN_COLUMNS.filter((c) => visibleColumnIds.includes(c.id)),
    [visibleColumnIds]
  );

  const visibleTasks = useMemo(() => {
    if (activeView !== "kanban" || !data?.data) {
      return data?.data || [];
    }
    const visibleStatuses = visibleColumnIds.map((id) => columnStatusMap[id]);
    return data.data.filter((task) => visibleStatuses.includes(task.status));
  }, [data?.data, visibleColumnIds, activeView]);

  const emptyState = (
    <EmptyState
      icon={<CheckSquare className="h-10 w-10 text-primary" />}
      title="No tasks here"
      description="No tasks match your current filter. Try selecting a different filter or create a new task."
    />
  );
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Tasks
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="task-filter" className="sr-only">
                Filter tasks
              </Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger
                  id="task-filter"
                  className="border-slate-700 bg-kanban-column text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_assigned">
                    All Assigned Tasks
                  </SelectItem>
                  <SelectItem value="assigned_project">
                    Assigned Project Tasks
                  </SelectItem>
                  <SelectItem value="assigned_standalone">
                    Assigned Standalone Tasks
                  </SelectItem>
                  <SelectItem value="created_project">
                    Created Project Tasks
                  </SelectItem>
                  <SelectItem value="created_standalone">
                    Created Standalone Tasks
                  </SelectItem>
                </SelectContent>
              </Select>
              {activeView === "kanban" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-slate-700 bg-kanban-column text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Columns className="mr-2 h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {KANBAN_COLUMNS.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={visibleColumnIds.includes(column.id)}
                        onCheckedChange={(checked) => {
                          setVisibleColumnIds((prev) =>
                            checked
                              ? [...prev, column.id]
                              : prev.filter((id) => id !== column.id)
                          );
                        }}
                      >
                        {column.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <ResourceCrudDialog
              isOpen={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              trigger={
                <Button
                  className="bg-kanban-accent text-white hover:bg-kanban-accent/80"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              }
              title="Create a new task"
              description="Fill in the details below to add a new task."
              form={CreateTaskForm}
              resourcePath="/tasks"
              resourceKey={["myTasks"]}
            />
          </div>
        </div>
        <Tabs value={activeView} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            {isLoading ? (
              <TaskListSkeleton />
            ) : (
              <TaskList
                onTaskSelect={handleTaskSelect}
                tasks={data?.data || []}
                emptyState={emptyState}
                apiUrl="tasks"
                queryKey={["myTasks"]}
                sorting={sorting}
                setSorting={setSorting}
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
                tasks={visibleTasks}
                onTaskSelect={handleTaskSelect}
                columns={visibleColumns}
                columnStatusMap={columnStatusMap}
              />
            )}
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            {isLoading ? (
              <TaskListSkeleton />
            ) : (
              <CalendarView
                tasks={data?.data || []}
                onTaskSelect={handleTaskSelect}
                onTaskUpdate={handleTaskUpdate}
              />
            )}
          </TabsContent>
          <TabsContent value="gantt" className="mt-4">
            {isLoading ? (
              <TaskListSkeleton />
            ) : (
              <GanttChartView
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