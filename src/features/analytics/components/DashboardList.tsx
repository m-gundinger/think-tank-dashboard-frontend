import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { useManageDashboards } from "../api/useManageDashboards";
import { DashboardCard } from "./DashboardCard";
import { DashboardForm } from "./DashboardForm";
import { Dashboard } from "@/types";

export function DashboardList(scope: {
  workspaceId?: string;
  projectId?: string;
}) {
  const dashboardResource = useManageDashboards(scope);

  const { data, isLoading, isError } = dashboardResource.useGetAll();
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(
    null
  );

  if (isLoading) return <div>Loading dashboards...</div>;
  if (isError) return <div>Error loading dashboards.</div>;
  if (!data || data.data.length === 0) {
    return (
      <p className="text-muted-foreground">
        No dashboards have been created yet. Create one to begin!
      </p>
    );
  }

  const resourceKey = scope.projectId
    ? ["dashboards", scope.projectId]
    : scope.workspaceId
      ? ["dashboards", scope.workspaceId]
      : ["dashboards", "user"];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((dashboard: Dashboard) => (
          <DashboardCard
            dashboard={dashboard}
            key={dashboard.id}
            onEdit={() => setEditingDashboardId(dashboard.id)}
          />
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingDashboardId}
        onOpenChange={(isOpen) => !isOpen && setEditingDashboardId(null)}
        resourceId={editingDashboardId}
        resourcePath={"dashboards"}
        resourceKey={resourceKey}
        title="Edit Dashboard"
        description="Make changes to your dashboard here. Click save when you're done."
        form={DashboardForm}
        formProps={{ scope }}
      />
    </>
  );
}