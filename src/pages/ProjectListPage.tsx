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
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [dialogState, setDialogState] = useState({
    open: false,
    type: "create",
  });

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

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
      <ProjectList workspaceId={workspaceId} />
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "create"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create a new project"
        description="Projects live inside workspaces and contain your tasks."
        form={ProjectForm}
        formProps={{ workspaceId }}
        resourcePath={`workspaces/${workspaceId}/projects`}
        resourceKey={["projects", workspaceId]}
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
        resourcePath={""} // Not a standard resource, mutation is custom
        resourceKey={[]}
      />
    </ListPageLayout>
  );
}