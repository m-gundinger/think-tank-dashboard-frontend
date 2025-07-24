import { HomeDashboard } from "@/features/home/components/HomeDashboard";

export function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Your personal command center for tasks, mentions, and notifications.
        </p>
      </div>
      <HomeDashboard />
    </div>
  );
}
