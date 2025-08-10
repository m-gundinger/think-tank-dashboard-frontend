import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { TaskDetailModal } from "@/features/project-management/components/TaskDetailModal";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Task, View, ViewColumn, ViewType, ListTasksQuery } from "@/types";
import { SortingState } from "@tanstack/react-table";
import { useUpdateTask } from "@/features/project-management/api/useUpdateTask";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTaskForm } from "@/features/project-management/components/CreateTaskForm";
import { TemplateSelectorDialog } from "@/features/project-management/components/TemplateSelectorDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckSquare } from "lucide-react";
import { useGetViews } from "@/features/project-management/api/useGetViews";
import { useGetTasks } from "@/features/project-management/api/useGetTasks";
import { TasksPageHeader } from "./TasksPageHeader";
import { ListView } from "@/features/project-management/components/list-view/ListView";
import { KanbanBoard } from "@/features/project-management/components/kanban-view/KanbanBoard";
import { CalendarView } from "@/features/project-management/components/calendar-view/CalendarView";
import { GanttChartView } from "@/features/project-management/components/gantt-view/GanttChartView";
import { WhiteboardView } from "@/features/project-management/components/WhiteboardView";
import { Project, TaskStatus, TaskPriority } from "@/types";
import { BulkActionsToolbar } from "@/features/project-management/components/list-view/BulkActionsToolbar";
import { useManageTasks } from "@/features/project-management/api/useManageTasks";
import { useBulkUpdateTasks } from "@/features/project-management/api/useBulkUpdateTasks";

interface TasksPageProps {
  scope: "user" | "project";
  workspaceId?: string;
  projectId?: string;
  project?: Project;
}

const initialListColumns = [
  { id: "workspace", label: "Workspace", visible: true },
  { id: "project", label: "Project", visible: true },
  { id: "taskType", label: "Type", visible: true },
];

const KANBAN_COLUMNS_USER: Omit<ViewColumn, "createdAt" | "updatedAt">[] = [
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

const columnStatusMapUser: Record<string, TaskStatus> = {
  "col-todo": TaskStatus.TODO,
  "col-in-progress": TaskStatus.IN_PROGRESS,
  "col-in-review": TaskStatus.IN_REVIEW,
  "col-done": TaskStatus.DONE,
  "col-blocked": TaskStatus.BLOCKED,
  "col-cancelled": TaskStatus.CANCELLED,
};

function mapColumnNameToStatus(columnName: string): TaskStatus | null {
  const normalizedName = columnName.trim().toUpperCase().replace(/\s+/g, "_");
  if (normalizedName === "TO_DO") return TaskStatus.TODO;
  if (Object.values(TaskStatus).includes(normalizedName as TaskStatus)) {
    return normalizedName as TaskStatus;
  }
  return null;
}

export function TasksPage({
  scope,
  workspaceId,
  projectId,
  project,
}: TasksPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeViewId = searchParams.get("view") || "list";
  const selectedTaskId = searchParams.get("taskId");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderInColumn", desc: false },
  ]);
  const [filter, setFilter] = useState("all_assigned");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [listColumns, setListColumns] = useState(initialListColumns);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [kanbanColumnIds, setKanbanColumnIds] = useState<string[]>([
    "col-todo",
    "col-in-progress",
    "col-in-review",
    "col-done",
  ]);

  const updateTaskMutation = useUpdateTask();
  const { useDelete } = useManageTasks(workspaceId, projectId);
  const deleteMutation = useDelete();
  const bulkUpdateMutation = useBulkUpdateTasks(projectId);

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
      limit: activeViewId === "list" ? 15 : 200,
      page: 1,
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
  }, [filter, sorting, activeViewId]);

  const {
    data: viewsData,
    isLoading: isLoadingViews,
    isError: isViewsError,
  } = useGetViews({ scope, workspaceId, projectId });

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useGetTasks({
    scope,
    workspaceId,
    projectId,
    query: queryParams,
    enabled: scope === "user" || !!activeViewId,
  });

  const userViews: View[] = useMemo(
    () => [
      {
        id: "list",
        name: "List",
        type: ViewType.LIST,
        columns: [],
        isPublic: false,
        projectId: "",
      },
      {
        id: "kanban",
        name: "Kanban",
        type: ViewType.KANBAN,
        columns: KANBAN_COLUMNS_USER as ViewColumn[],
        isPublic: false,
        projectId: "",
      },
      {
        id: "calendar",
        name: "Calendar",
        type: ViewType.CALENDAR,
        columns: [],
        isPublic: false,
        projectId: "",
      },
      {
        id: "gantt",
        name: "Gantt",
        type: ViewType.GANTT,
        columns: [],
        isPublic: false,
        projectId: "",
      },
    ],
    []
  );

  const views = useMemo(
    () => (scope === "user" ? userViews : viewsData?.data || []),
    [scope, viewsData, userViews]
  );

  const activeView = useMemo(
    () => views.find((v) => v.id === activeViewId),
    [views, activeViewId]
  );

  const projectColumnStatusMap = useMemo(() => {
    if (scope !== "project" || !activeView?.columns) {
      return {};
    }
    return activeView.columns.reduce(
      (acc, col) => {
        const status = col.status || mapColumnNameToStatus(col.name);
        if (status) {
          acc[col.id] = status;
        }
        return acc;
      },
      {} as Record<string, TaskStatus>
    );
  }, [scope, activeView]);

  useEffect(() => {
    if (!isLoadingViews && views.length > 0 && !activeView) {
      const defaultView = views.find((v) => v.type === "LIST") || views[0];
      if (defaultView) {
        handleViewChange(defaultView.id);
      }
    }
  }, [isLoadingViews, views, activeView]);

  useEffect(() => {
    setSelectedTaskIds([]);
  }, [tasksData]);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({
      taskId,
      workspaceId,
      projectId,
      taskData: updates,
    });
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTaskIds.length} tasks?`
      )
    ) {
      deleteMutation.mutate(selectedTaskIds, {
        onSuccess: () => setSelectedTaskIds([]),
      });
    }
  };

  const handleBulkUpdate = (updates: {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
    taskTypeId?: string | null;
    dueDate?: Date | null;
    addAssigneeIds?: string[];
    removeAssigneeIds?: string[];
  }) => {
    bulkUpdateMutation.mutate(
      { taskIds: selectedTaskIds, updates },
      {
        onSuccess: () => setSelectedTaskIds([]),
      }
    );
  };

  const emptyState = (
    <EmptyState
      icon={<CheckSquare className="h-10 w-10 text-primary" />}
      title="No tasks here"
      description="No tasks match your current filter. Try selecting a different filter or create a new task."
    />
  );

  if (isViewsError || isTasksError) {
    return (
      <ErrorState
        title="Could not load tasks"
        message="Please try refreshing the page."
      />
    );
  }

  if (activeView?.type === "WHITEBOARD") {
    return <WhiteboardView />;
  }

  const isLoading = isLoadingViews || (!!activeViewId && isLoadingTasks);

  const visibleKanbanColumns = useMemo(
    () => KANBAN_COLUMNS_USER.filter((c) => kanbanColumnIds.includes(c.id)),
    [kanbanColumnIds]
  );

  return (
    <>
      <div className="space-y-4">
        <TasksPageHeader
          scope={scope}
          project={project}
          views={views}
          activeView={activeView}
          onViewChange={handleViewChange}
          onNewTaskClick={() => setIsCreateTaskOpen(true)}
          onNewTaskFromTemplateClick={() => setIsTemplateSelectorOpen(true)}
          sorting={sorting}
          setSorting={setSorting}
          listColumns={listColumns}
          onColumnVisibilityChange={(columnId, visible) =>
            setListColumns((prev) =>
              prev.map((c) => (c.id === columnId ? { ...c, visible } : c))
            )
          }
          filter={filter}
          onFilterChange={setFilter}
          kanbanColumns={KANBAN_COLUMNS_USER}
          kanbanColumnIds={kanbanColumnIds}
          setKanbanColumnIds={setKanbanColumnIds}
        />
        {selectedTaskIds.length > 0 && (
          <BulkActionsToolbar
            selectedTaskIds={selectedTaskIds}
            tasks={tasksData?.data || []}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
            isDeleting={deleteMutation.isPending}
            isUpdating={bulkUpdateMutation.isPending}
          />
        )}
        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : (
          <div className="h-[calc(100vh-250px)]">
            {activeView?.type === "LIST" && (
              <ListView
                onTaskSelect={handleTaskSelect}
                tasks={tasksData?.data || []}
                emptyState={emptyState}
                onTaskUpdate={handleTaskUpdate}
                showWorkspaceColumn={
                  scope === "user" &&
                  listColumns.find((c) => c.id === "workspace")?.visible
                }
                showProjectColumn={
                  scope === "user" &&
                  listColumns.find((c) => c.id === "project")?.visible
                }
                showTaskTypeColumn={
                  listColumns.find((c) => c.id === "taskType")?.visible
                }
                selectedTaskIds={selectedTaskIds}
                setSelectedTaskIds={setSelectedTaskIds}
              />
            )}
            {activeView?.type === "KANBAN" && (
              <KanbanBoard
                scope={scope}
                columns={
                  scope === "user" ? visibleKanbanColumns : activeView.columns
                }
                columnStatusMap={
                  scope === "user"
                    ? columnStatusMapUser
                    : projectColumnStatusMap
                }
                tasks={tasksData?.data || []}
                workspaceId={workspaceId}
                projectId={projectId}
                onTaskSelect={handleTaskSelect}
              />
            )}
            {activeView?.type === "GANTT" && (
              <GanttChartView
                tasks={tasksData?.data || []}
                onTaskSelect={handleTaskSelect}
              />
            )}
            {activeView?.type === "CALENDAR" && (
              <CalendarView
                tasks={tasksData?.data || []}
                onTaskSelect={handleTaskSelect}
                onTaskUpdate={handleTaskUpdate}
              />
            )}
          </div>
        )}
      </div>

      <ResourceCrudDialog
        isOpen={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        title="Create a new task"
        description="Fill in the details below to add a new task."
        form={CreateTaskForm}
        formProps={{ workspaceId, projectId }}
        resourcePath={
          projectId
            ? `/workspaces/${workspaceId}/projects/${projectId}/tasks`
            : "/tasks"
        }
        resourceKey={projectId ? ["tasks", projectId] : ["myTasks"]}
      />

      <TemplateSelectorDialog
        isOpen={isTemplateSelectorOpen}
        onOpenChange={setIsTemplateSelectorOpen}
        workspaceId={workspaceId}
        projectId={projectId}
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
