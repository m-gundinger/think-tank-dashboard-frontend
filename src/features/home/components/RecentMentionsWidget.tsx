import { DashboardWidget } from "./DashboardWidget";

export function RecentMentionsWidget() {
  // This would fetch data from a new endpoint like /notifications?type=mention
  return (
    <DashboardWidget title="Recent Mentions">
      <p className="text-muted-foreground text-sm">You have no new mentions.</p>
    </DashboardWidget>
  );
}
