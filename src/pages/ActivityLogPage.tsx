import { GlobalActivityLog } from "@/features/activities/components/GlobalActivityLog";

export function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Activity</h1>
        <p className="text-muted-foreground">
          A stream of recent activity from all projects you have access to.
        </p>
      </div>
      <GlobalActivityLog />
    </div>
  );
}
