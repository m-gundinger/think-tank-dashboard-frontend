import { WorkspaceList } from "@/features/workspaces/components/WorkspaceList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WorkspaceForm } from "@/features/workspaces/components/WorkspaceForm";

export function WorkspacesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">
            Select a workspace to view its projects.
          </p>
        </div>
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
      </div>

      <WorkspaceList />
    </div>
  );
}