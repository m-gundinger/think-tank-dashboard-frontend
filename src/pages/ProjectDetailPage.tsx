import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { TaskDetailModal } from "@/features/tasks/components/TaskDetailModal";
import { useApiResource } from "@/hooks/useApiResource";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { usePresence } from "@/hooks/usePresence";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetailView } from "./ProjectDetailView";
import { ListTasksQuery } from "@/features/tasks/task.types";
import { View } from "@/types";
import { useGetViewData } from "@/features/views/api/useGetViewData";

export function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get("view");
  const selectedTaskId = searchParams.get("taskId");
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
  const viewDataQuery: ListTasksQuery = {
    page: 1,
    limit: 100,
    includeSubtasks: false,
    sortBy: "orderInColumn" as const,
    sortOrder: "asc" as const,
  };
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
    setSearchParams((params) => {
      params.set("view", newTab);
      return params;
    });
  };

  useEffect(() => {
    if (!isLoadingViews && viewsData && !activeTabId) {
      const listTabView = viewsData.data?.find((v: any) => v.name === "List");
      const defaultViewId =
        listTabView?.id || viewsData.data?.[0]?.id || "dashboards";
      handleTabChange(defaultViewId);
    }
  }, [isLoadingViews, viewsData, activeTabId, handleTabChange]);
  const handleTaskSelect = (taskId: string | null) => {
    setSearchParams((params) => {
      if (taskId) {
        params.set("taskId", taskId);
      } else {
        params.delete("taskId");
      }
      return params;
    });
  };

  if (!workspaceId || !projectId) {
    return <div>Invalid Project ID</div>;
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
        activeTab={activeTabId}
        onTabChange={handleTabChange}
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
