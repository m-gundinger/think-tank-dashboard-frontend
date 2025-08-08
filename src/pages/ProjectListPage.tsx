import { ProjectList } from "@/features/project-management/components/ProjectList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ProjectForm } from "@/features/project-management/components/ProjectForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectFromTemplateForm } from "@/features/project-management/components/CreateProjectFromTemplateForm";

export function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateFromTemplateOpen, setIsCreateFromTemplateOpen] =
    useState(false);

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
          resourcePath={`workspaces/${workspaceId}/projects`}
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
      <ProjectList workspaceId={workspaceId} />
    </div>
  );
}