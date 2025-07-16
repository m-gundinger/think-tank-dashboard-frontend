import { StatsCounterWidget } from "./StatsCounterWidget";
import { TaskListWidget } from "./TaskListWidget";
import { BurndownChartWidget } from "./BurndownChartWidget";
import { TimeTrackingReportWidget } from "./TimeTrackingReportWidget";
import { WidgetWrapper } from "./WidgetWrapper";

export function WidgetRenderer({ widget, workspaceId, projectId }: any) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case "STATS_COUNTER":
        return (
          <StatsCounterWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case "TASK_LIST":
        return (
          <TaskListWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case "BURNDOWN_CHART":
        return (
          <BurndownChartWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case "TIME_TRACKING_REPORT":
        return (
          <TimeTrackingReportWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <WidgetWrapper
      widget={widget}
      workspaceId={workspaceId}
      projectId={projectId}
    >
      {renderWidgetContent()}
    </WidgetWrapper>
  );
}
