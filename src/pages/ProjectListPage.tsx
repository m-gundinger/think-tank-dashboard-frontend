import { ProjectList } from "@/features/projects/components/ProjectList";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { useParams } from "react-router-dom";

export function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

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
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>
      <ProjectList workspaceId={workspaceId} />
    </div>
  );
}
