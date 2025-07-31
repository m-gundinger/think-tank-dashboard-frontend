import { GoalList } from "@/features/goals/components/GoalList";
import { useParams } from "react-router-dom";
export function ProjectGoalsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  if (!workspaceId || !projectId) {
    return <div>Missing URL parameters.</div>;
  }

  return (
    <div className="space-y-6">
      <GoalList workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}