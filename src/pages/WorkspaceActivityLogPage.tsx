import { ActivityLog } from "@/features/analytics/components/ActivityLog";
import { useParams } from "react-router-dom";

export function WorkspaceActivityLogPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <ActivityLog scope={{ workspaceId }} title="Workspace Activity Feed" />
    </div>
  );
}
