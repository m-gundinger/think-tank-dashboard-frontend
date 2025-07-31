import { DashboardWidget } from "./DashboardWidget";

export function RecentMentionsWidget() {
  return (
    <DashboardWidget title="Recent Mentions">
      <p className="text-muted-foreground text-sm">You have no new mentions.</p>
    </DashboardWidget>
  );
}