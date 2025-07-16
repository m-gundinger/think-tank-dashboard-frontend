import { useGetDashboards } from "../api/useGetDashboards";
import { DashboardCard } from "./DashboardCard";
import { useState } from "react";
import { EditDashboardDialog } from "./EditDashboardDialog";

export function DashboardList({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const { data, isLoading, isError } = useGetDashboards(workspaceId, projectId);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(
    null
  );

  if (isLoading) return <div>Loading dashboards...</div>;
  if (isError) return <div>Error loading dashboards.</div>;
  if (!data || data.data.length === 0) {
    return <p>This project has no dashboards yet. Create one to begin!</p>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((dashboard: any) => (
          <DashboardCard
            dashboard={{ ...dashboard, workspaceId, projectId }}
            key={dashboard.id}
            onEdit={setEditingDashboardId}
          />
        ))}
      </div>
      <EditDashboardDialog
        workspaceId={workspaceId}
        projectId={projectId}
        dashboardId={editingDashboardId}
        isOpen={!!editingDashboardId}
        onOpenChange={(isOpen) => !isOpen && setEditingDashboardId(null)}
      />
    </>
  );
}
