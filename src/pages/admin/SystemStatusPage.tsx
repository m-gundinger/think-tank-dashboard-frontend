import { SystemStatusDashboard } from "@/features/admin/system-status/components/SystemStatusDashboard";

export function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground">
          A real-time overview of the application's health and core
          dependencies.
        </p>
      </div>
      <SystemStatusDashboard />
    </div>
  );
}