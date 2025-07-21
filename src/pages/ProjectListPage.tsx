import { ProjectList } from "@/features/projects/components/ProjectList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ProjectForm } from "@/features/projects/components/ProjectForm";

export function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
          <p className="text-muted-foreground">
            A list of all projects within this workspace.
          </p>
        </div>
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
      </div>
      <ProjectList workspaceId={workspaceId} />
    </div>
  );
}
