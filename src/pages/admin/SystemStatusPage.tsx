import { SystemStatusDashboard } from "@/features/admin/system-status/components/SystemStatusDashboard";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function SystemStatusPage() {
  return (
    <ListPageLayout
      title="System Status"
      description="A real-time overview of the application's health and core
      dependencies."
    >
      <SystemStatusDashboard />
    </ListPageLayout>
  );
}