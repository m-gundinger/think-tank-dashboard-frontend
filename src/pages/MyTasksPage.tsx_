import { TaskDetailModal } from "@/features/project-management/components/TaskDetailModal";
import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
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
import { MyTasksKanbanBoard } from "@/features/project-management/components/kanban-view/MyTasksKanbanBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckSquare, PlusCircle, Filter, Columns, Trash2 } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "@/features/project-management/components/CreateTaskForm";
import { useGetMyTasks } from "@/features/project-management/api/useGetMyTasks";
import { CalendarView } from "@/features/project-management/components/calendar-view/CalendarView";
import { GanttChartView } from "@/features/project-management/components/gantt-view/GanttChartView";
import { SortingState } from "@tanstack/react-table";
import { useUpdateTask } from "@/features/project-management/api/useUpdateTask";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatus } from "@/types/api";
import { ListView } from "@/features/project-management/components/list-view/ListView";
import { SortMenu } from "@/features/project-management/components/list-view/SortMenu";
import { ColumnVisibilityToggle } from "@/features/project-management/components/list-view/ColumnVisibilityToggle";
import { useManageTasks } from "@/features/project-management/api/useManageTasks";
import { TemplateSelectorDialog } from "@/features/project-management/components/TemplateSelectorDialog";

const TaskListSkeleton = () => (
  <div className="space-y-2 pt-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);

const KANBAN_COLUMNS: Omit<ViewColumn, "createdAt" | "updatedAt">[] = [
  { id: "col-todo", name: "To Do", order: 1, viewId: "my-tasks-view" },
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
  { id: "col-done", name: "Done", order: 4, viewId: "my-tasks-view" },
  { id: "col-blocked", name: "Blocked", order: 5, viewId: "my-tasks-view" },
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

const listSortableColumns = [
  { id: "title", label: "Task Name" },
  { id: "priority", label: "Priority" },
  { id: "dueDate", label: "Due Date" },
  { id: "status", label: "Status" },
  { id: "projectName", label: "Project" },
  { id: "workspaceName", label: "Workspace" },
];

const initialListColumns = [
  { id: "workspace", label: "Workspace", visible: true },
  { id: "project", label: "Project", visible: true },
  { id: "taskType", label: "Type", visible: true },
];

export function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");
  const activeView = searchParams.get("view") || "list";
  const [page] = useState(1);
  const [filter, setFilter] = useState("all_assigned");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "priority", desc: true },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [kanbanColumnIds, setKanbanColumnIds] = useState<string[]>([
    "col-todo",
    "col-in-progress",
    "col-in-review",
    "col-done",
  ]);
  const [listColumns, setListColumns] = useState(initialListColumns);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const updateTaskMutation = useUpdateTask();
  const { useDelete } = useManageTasks();
  const bulkDeleteMutation = useDelete();

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

  useEffect(() => {
    setSelectedTaskIds([]);
  }, [data]);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({
      taskId,
      taskData: updates,
    });
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTaskIds.length} tasks?`
      )
    ) {
      bulkDeleteMutation.mutate(selectedTaskIds, {
        onSuccess: () => setSelectedTaskIds([]),
      });
    }
  };

  const visibleKanbanColumns = useMemo(
    () => KANBAN_COLUMNS.filter((c) => kanbanColumnIds.includes(c.id)),
    [kanbanColumnIds]
  );

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
        <header className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Tasks
            </h1>
          </div>
          <div className="mt-4 flex items-center space-x-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <Label htmlFor="task-filter" className="sr-only">
                Filter tasks
              </Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger
                  id="task-filter"
                  className="border-border bg-element text-foreground hover:bg-hover [&>svg]:hidden"
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
              <SortMenu
                sorting={sorting}
                setSorting={setSorting}
                sortableColumns={listSortableColumns}
              />
              {activeView === "list" && (
                <ColumnVisibilityToggle
                  columns={listColumns}
                  onVisibilityChange={(columnId, visible) => {
                    setListColumns((prev) =>
                      prev.map((c) =>
                        c.id === columnId ? { ...c, visible } : c
                      )
                    );
                  }}
                />
              )}
              {activeView === "kanban" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-border bg-element text-foreground hover:bg-hover"
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
                        checked={kanbanColumnIds.includes(column.id)}
                        onCheckedChange={(checked) => {
                          setKanbanColumnIds((prev) =>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Task
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
                  New Blank Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsTemplateSelectorOpen(true)}
                >
                  New from Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {selectedTaskIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
            <span className="text-sm font-medium">
              {selectedTaskIds.length} task(s) selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

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
              <ListView
                onTaskSelect={handleTaskSelect}
                tasks={data?.data || []}
                emptyState={emptyState}
                onTaskUpdate={handleTaskUpdate}
                showWorkspaceColumn={
                  listColumns.find((c) => c.id === "workspace")?.visible ?? true
                }
                showProjectColumn={
                  listColumns.find((c) => c.id === "project")?.visible ?? true
                }
                showTaskTypeColumn={
                  listColumns.find((c) => c.id === "taskType")?.visible ?? true
                }
                selectedTaskIds={selectedTaskIds}
                setSelectedTaskIds={setSelectedTaskIds}
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
                columns={visibleKanbanColumns}
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

      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create a new task"
        description="Fill in the details below to add a new task."
        form={CreateTaskForm}
        formProps={{}}
        resourcePath="/tasks"
        resourceKey={["myTasks"]}
      />

      <TemplateSelectorDialog
        isOpen={isTemplateSelectorOpen}
        onOpenChange={setIsTemplateSelectorOpen}
      />

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
