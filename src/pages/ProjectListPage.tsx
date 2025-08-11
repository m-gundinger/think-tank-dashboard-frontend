import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { ProjectForm } from "@/features/project-management/components/ProjectForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectFromTemplateForm } from "@/features/project-management/components/CreateProjectFromTemplateForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { useManageProjects } from "@/features/project-management/api/useManageProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderKanban } from "lucide-react";
import { ProjectCard } from "@/features/project-management/components/ProjectCard";

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

export function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [dialogState, setDialogState] = useState({
    open: false,
    type: "create",
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const { useGetAll, resourceUrl, resourceKey } =
    useManageProjects(workspaceId);
  const { data, isLoading, isError, error } = useGetAll();

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  const handleEdit = (projectId: string) => {
    setEditingProjectId(projectId);
  };

  const renderContent = () => {
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
      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((project: any) => (
          <ProjectCard project={project} key={project.id} onEdit={handleEdit} />
        ))}
      </div>
    );
  };

  return (
    <ListPageLayout
      title="All Projects"
      description="A list of all projects within this workspace."
      actionButton={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setDialogState({ open: true, type: "create" })}
            >
              New Blank Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setDialogState({ open: true, type: "createFromTemplate" })
              }
            >
              New from Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      {renderContent()}
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "create"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create a new project"
        description="Projects live inside workspaces and contain your tasks."
        form={ProjectForm}
        formProps={{ workspaceId }}
        resourcePath={resourceUrl}
        resourceKey={resourceKey}
      />
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "createFromTemplate"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create from Template"
        description="Create a new project based on an existing template."
        form={CreateProjectFromTemplateForm}
        formProps={{ workspaceId }}
        resourcePath={""}
        resourceKey={[]}
      />
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
    </ListPageLayout>
  );
}
