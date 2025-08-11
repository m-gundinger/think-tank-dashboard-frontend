import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderKanban } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { ProjectForm } from "./ProjectForm";
import { useManageProjects } from "../api/useManageProjects";

const ProjectListSkeleton = () => (
  <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
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
  const { useGetAll, resourceUrl, resourceKey } =
    useManageProjects(workspaceId);
  const { data, isLoading, isError, error } = useGetAll();
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
          "There was a problem fetching projects for this workspace. Please try again later."
        }
      />
    );
  }

  const handleEdit = (projectId: string) => {
    setEditingProjectId(projectId);
  };

  if (!data || data.data.length === 0) {
    return (
      <div className="pt-6">
        <EmptyState
          icon={<FolderKanban className="h-10 w-10 text-primary" />}
          title="This workspace has no projects yet."
          description="Create the first project in this workspace to get started."
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((project: any) => (
          <ProjectCard project={project} key={project.id} onEdit={handleEdit} />
        ))}
      </div>

      <ResourceCrudDialog
        isOpen={!!editingProjectId}
        onOpenChange={(isOpen) => !isOpen && setEditingProjectId(null)}
        title="Edit Project"
        description="Make changes to your project here. Click save when you're done."
        form={ProjectForm}
        formProps={{ workspaceId }}
        resourcePath={resourceUrl}
        resourceKey={resourceKey}
        resourceId={editingProjectId}
      />
    </>
  );
}