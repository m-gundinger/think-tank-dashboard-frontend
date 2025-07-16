import { CreateWorkspaceDialog } from "@/features/workspaces/components/CreateWorkspaceDialog";
import { WorkspaceList } from "@/features/workspaces/components/WorkspaceList";

export function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">
            Select a workspace to view its projects.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      <WorkspaceList />
    </div>
  );
}
