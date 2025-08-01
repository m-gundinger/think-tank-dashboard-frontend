import { WorkloadView } from "@/features/reporting/components/WorkloadView";

export function ReportingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
        <p className="text-muted-foreground">
          View task distribution and workload across all your projects.
        </p>
      </div>
      <WorkloadView />
    </div>
  );
}
