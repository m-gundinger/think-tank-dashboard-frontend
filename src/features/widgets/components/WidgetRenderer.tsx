import { StatsCounterWidget } from "./StatsCounterWidget";
import { TaskListWidget } from "./TaskListWidget";
import { BurndownChartWidget } from "./BurndownChartWidget";
import { TimeTrackingReportWidget } from "./TimeTrackingReportWidget";
import { PieChartWidget } from "./PieChartWidget";
import { GoalTrackingWidget } from "./GoalTrackingWidget";
import { LeadCycleTimeChartWidget } from "./LeadCycleTimeChartWidget";
import { WidgetWrapper } from "./WidgetWrapper";
import { WidgetType } from "@/types";

export function WidgetRenderer({ widget, workspaceId, projectId }: any) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case WidgetType.STATS_COUNTER:
        return (
          <StatsCounterWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.TASK_LIST:
        return (
          <TaskListWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.BURNDOWN_CHART:
        return (
          <BurndownChartWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.TIME_TRACKING_REPORT:
        return (
          <TimeTrackingReportWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.PIE_CHART:
        return (
          <PieChartWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.GOAL_TRACKING:
        return (
          <GoalTrackingWidget
            widget={widget}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        );
      case WidgetType.LEAD_CYCLE_TIME_CHART:
        return (
          <LeadCycleTimeChartWidget
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