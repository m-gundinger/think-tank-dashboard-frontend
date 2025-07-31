import { useApiResource } from "@/hooks/useApiResource";
import { ProjectCard } from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FolderKanban } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ProjectForm } from "./ProjectForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectFromTemplateForm } from "./CreateProjectFromTemplateForm";

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
  const projectResource = useApiResource(
    `/workspaces/${workspaceId}/projects`,
    ["projects", workspaceId]
  );
  const { data, isLoading, isError, error } = projectResource.useGetAll();
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateFromTemplateOpen, setIsCreateFromTemplateOpen] =
    useState(false);

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

  const handleEdit = (projectId: string) => {
    setEditingProjectId(projectId);
  };

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="text-primary h-10 w-10" />}
        title="This workspace has no projects yet."
        description="Create the first project in this workspace to get started."
        action={
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            }
            title="Create a new project"
            description="Projects live inside workspaces and contain your tasks."
            form={ProjectForm}
            formProps={{ workspaceId }}
            resourcePath={`/workspaces/${workspaceId}/projects`}
            resourceKey={["projects", workspaceId]}
          />
        }
      />
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
              New Blank Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsCreateFromTemplateOpen(true)}>
              New from Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          title="Create a new project"
          description="Projects live inside workspaces and contain your tasks."
          form={ProjectForm}
          formProps={{ workspaceId }}
          resourcePath={`/workspaces/${workspaceId}/projects`}
          resourceKey={["projects", workspaceId]}
        />
        <ResourceCrudDialog
          isOpen={isCreateFromTemplateOpen}
          onOpenChange={setIsCreateFromTemplateOpen}
          title="Create from Template"
          description="Create a new project based on an existing template."
          form={CreateProjectFromTemplateForm}
          formProps={{ workspaceId }}
          resourcePath={""}
          resourceKey={[]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        resourcePath={`/workspaces/${workspaceId}/projects`}
        resourceKey={["projects", workspaceId]}
        resourceId={editingProjectId}
      />
    </>
  );
}