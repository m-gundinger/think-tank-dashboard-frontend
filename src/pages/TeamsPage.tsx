import { TeamList } from "@/features/teams/components/TeamList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { TeamForm } from "@/features/teams/components/TeamForm";

export function TeamsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Teams</h2>
          <p className="text-muted-foreground">
            Manage teams within your workspace.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Team
            </Button>
          }
          title="Create a new team"
          description="Teams help you group users within a workspace."
          form={TeamForm}
          formProps={{ workspaceId }}
          resourcePath={`workspaces/${workspaceId}/teams`}
          resourceKey={["teams", workspaceId]}
        />
      </div>

      <TeamList workspaceId={workspaceId} />
    </div>
  );
}