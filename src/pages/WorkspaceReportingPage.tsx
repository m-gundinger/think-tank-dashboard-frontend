import { ReportingOverview } from "@/features/analytics/components/ReportingOverview";
import { useParams } from "react-router-dom";

export function WorkspaceReportingPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return <ReportingOverview scope={{ workspaceId }} />;
}