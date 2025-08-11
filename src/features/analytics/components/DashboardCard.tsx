import { CardContent } from "@/components/ui/card";
import { useManageDashboards } from "../api/useManageDashboards";
import { Dashboard } from "@/types";
import { EntityCard } from "@/components/shared/EntityCard";
import { ActionMenu } from "@/components/shared/ActionMenu";

interface DashboardCardProps {
  dashboard: Dashboard;
  onEdit: (dashboardId: string) => void;
}

export function DashboardCard({ dashboard, onEdit }: DashboardCardProps) {
  const dashboardResource = useManageDashboards({
    workspaceId: dashboard.workspaceId ?? undefined,
    projectId: dashboard.projectId ?? undefined,
  });

  const deleteMutation = dashboardResource.useDelete();
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${dashboard.name}" dashboard?`
      )
    ) {
      deleteMutation.mutate(dashboard.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(dashboard.id);
  };

  const dashboardUrl =
    dashboard.projectId && dashboard.workspaceId
      ? `/workspaces/${dashboard.workspaceId}/projects/${dashboard.projectId}/dashboards/${dashboard.id}`
      : dashboard.workspaceId
        ? `/workspaces/${dashboard.workspaceId}/dashboards/${dashboard.id}`
        : `/dashboards/${dashboard.id}`;

  return (
    <EntityCard
      title={dashboard.name}
      description={dashboard.description || "No description provided."}
      linkTo={dashboardUrl}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <CardContent />
    </EntityCard>
  );
}