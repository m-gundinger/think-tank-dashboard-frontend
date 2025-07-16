import { useGetProjects } from "../api/useGetProjects";
import { ProjectCard } from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderKanban } from "lucide-react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useState } from "react";
import { EditProjectDialog } from "./EditProjectDialog";

const ProjectListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function ProjectList({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading, isError, error } = useGetProjects(workspaceId);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  if (isLoading) {
    return <ProjectListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Projects"
        message={
          (error as any)?.response?.data?.message ||
          "There was a problem fetching projects for this workspace."
        }
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="text-primary h-10 w-10" />}
        title="This workspace has no projects yet."
        description="Create the first project in this workspace to get started."
        action={<CreateProjectDialog workspaceId={workspaceId} />}
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((project: any) => (
          <ProjectCard
            project={project}
            key={project.id}
            onEdit={setEditingProjectId}
          />
        ))}
      </div>

      <EditProjectDialog
        workspaceId={workspaceId}
        projectId={editingProjectId}
        isOpen={!!editingProjectId}
        onOpenChange={(isOpen) => !isOpen && setEditingProjectId(null)}
      />
    </>
  );
}
