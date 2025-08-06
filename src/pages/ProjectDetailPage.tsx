import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { TaskDetailModal } from "@/features/project-management/components/TaskDetailModal";
import { useApiResource } from "@/hooks/useApiResource";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { usePresence } from "@/hooks/usePresence";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetailView } from "@/features/project-management/components/ProjectDetailView";
import { ListTasksQuery, Task, View } from "@/types";
import { useGetViewData } from "@/features/project-management/api/useGetViewData";
import { WhiteboardView } from "@/features/project-management/components/WhiteboardView";
import { SortingState } from "@tanstack/react-table";
import { useUpdateTask } from "@/features/project-management/api/useUpdateTask";

export function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get("view");
  const selectedTaskId = searchParams.get("taskId");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderInColumn", desc: false },
  ]);
  const updateTaskMutation = useUpdateTask();

  const viewsResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/views`,
    ["views", projectId]
  );
  const {
    data: viewsData,
    isLoading: isLoadingViews,
    isError: isViewsError,
  } = viewsResource.useGetAll();
  const activeView = useMemo(
    () => (viewsData?.data || []).find((v: View) => v.id === activeTabId),
    [viewsData, activeTabId]
  );
  const viewDataQuery: ListTasksQuery = useMemo(
    () => ({
      page: 1,
      limit: 1000,
      includeSubtasks: true,
      sortBy: (sorting[0]?.id as ListTasksQuery["sortBy"]) ?? "orderInColumn",
      sortOrder: sorting[0]?.desc ? "desc" : "asc",
    }),
    [sorting]
  );

  const {
    data: viewData,
    isLoading: isLoadingViewData,
    isError: isViewDataError,
  } = useGetViewData(workspaceId!, projectId!, activeTabId, viewDataQuery, {
    enabled: !!activeView,
  });
  useProjectSocket(projectId!);
  usePresence("Project", projectId!);

  const handleTabChange = (newTab: string) => {
    setSearchParams(
      (params) => {
        params.set("view", newTab);
        return params;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (!isLoadingViews && viewsData && !activeTabId) {
      const defaultView =
        viewsData.data?.find((v: any) => v.type === "LIST") ||
        viewsData.data?.[0];
      if (defaultView) {
        handleTabChange(defaultView.id);
      } else {
        handleTabChange("dashboards"); // Fallback if no views exist
      }
    }
  }, [isLoadingViews, viewsData, activeTabId, setSearchParams]);

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

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({
      taskId,
      workspaceId,
      projectId,
      taskData: updates,
    });
  };

  if (!workspaceId || !projectId) {
    return <div>Invalid Project ID</div>;
  }

  if (activeView?.type === "WHITEBOARD") {
    return <WhiteboardView />;
  }

  if (isViewsError || isViewDataError) {
    return (
      <ErrorState
        title="Could not load project data"
        message="Please try again later."
      />
    );
  }

  const isLoading = isLoadingViews || (!!activeView && isLoadingViewData);
  if (isLoading || !activeTabId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[450px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <>
      <ProjectDetailView
        views={viewsData?.data || []}
        tasks={viewData?.data || []}
        workspaceId={workspaceId}
        projectId={projectId}
        onTaskSelect={handleTaskSelect}
        onTaskUpdate={handleTaskUpdate}
        activeTab={activeTabId}
        onTabChange={handleTabChange}
        sorting={sorting}
        setSorting={setSorting}
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