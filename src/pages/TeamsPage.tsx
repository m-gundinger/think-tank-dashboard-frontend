import { CreateTeamDialog } from "@/features/teams/components/CreateTeamDialog";
import { TeamList } from "@/features/teams/components/TeamList";
import { useParams } from "react-router-dom";

export function TeamsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

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
        <CreateTeamDialog workspaceId={workspaceId} />
      </div>

      <TeamList workspaceId={workspaceId} />
    </div>
  );
}
