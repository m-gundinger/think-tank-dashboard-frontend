import { useParams } from "react-router-dom";
import { usePresence } from "@/hooks/usePresence";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useManageProjects } from "@/features/project-management/api/useManageProjects";
import { TasksPage } from "./TasksPage";
import { useProjectSocket } from "@/hooks/useProjectSocket";

export function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  if (!workspaceId || !projectId) {
    return <div>Invalid Project or Workspace ID</div>;
  }

  const projectResource = useManageProjects(workspaceId);
  const {
    data: projectData,
    isLoading: isLoadingProject,
    isError,
  } = projectResource.useGetOne(projectId);

  useProjectSocket(projectId);
  usePresence("Project", projectId);

  if (isError) {
    return (
      <ErrorState
        title="Could not load project data"
        message="Please try again later."
      />
    );
  }

  if (isLoadingProject) {
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
    <TasksPage
      scope="project"
      workspaceId={workspaceId}
      projectId={projectId}
      project={projectData}
    />
  );
}