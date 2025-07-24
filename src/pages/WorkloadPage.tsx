import { WorkloadView } from "@/features/reporting/components/WorkloadView";
import { useParams } from "react-router-dom";

export function WorkloadPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workload</h1>
        <p className="text-muted-foreground">
          View task distribution and workload across team members in this
          workspace.
        </p>
      </div>
      <WorkloadView workspaceId={workspaceId} />
    </div>
  );
}