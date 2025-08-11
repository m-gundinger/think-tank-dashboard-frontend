import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { WorkspaceForm } from "@/features/workspaces/components/WorkspaceForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { WorkspaceList } from "@/features/workspaces/components/WorkspaceList";

export function WorkspacesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <ListPageLayout
      title="Workspaces"
      description="Select a workspace to view its projects."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
          }
          title="Create a new workspace"
          description="Workspaces help you organize your projects and teams."
          form={WorkspaceForm}
          resourcePath="workspaces"
          resourceKey={["workspaces"]}
        />
      }
    >
      <WorkspaceList />
    </ListPageLayout>
  );
}
