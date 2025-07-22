// FILE: src/features/dashboards/components/DashboardList.tsx
import { useApiResource } from "@/hooks/useApiResource";
import { DashboardCard } from "./DashboardCard";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateDashboardForm } from "./CreateDashboardForm";

export function DashboardList({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId?: string;
}) {
  const resourceUrl = projectId
    ? `/workspaces/${workspaceId}/projects/${projectId}/dashboards`
    : `/workspaces/${workspaceId}/dashboards`;
  const resourceKey = projectId
    ? ["dashboards", projectId]
    : ["dashboards", workspaceId];

  const dashboardResource = useApiResource(resourceUrl, resourceKey);

  const { data, isLoading, isError } = dashboardResource.useGetAll();
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(
    null
  );

  if (isLoading) return <div>Loading dashboards...</div>;
  if (isError) return <div>Error loading dashboards.</div>;
  if (!data || data.data.length === 0) {
    return <p>No dashboards have been created yet. Create one to begin!</p>;
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
      <ResourceCrudDialog
        isOpen={!!editingDashboardId}
        onOpenChange={(isOpen) => !isOpen && setEditingDashboardId(null)}
        resourceId={editingDashboardId}
        resourcePath={resourceUrl}
        resourceKey={resourceKey}
        title="Edit Dashboard"
        description="Make changes to your dashboard here. Click save when you're done."
        form={CreateDashboardForm}
        formProps={{ workspaceId, projectId }}
      />
    </>
  );
}
