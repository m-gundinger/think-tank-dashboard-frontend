import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/features/project-management/components/kanban-view/KanbanBoard";
import { GanttChartView } from "@/features/project-management/components/gantt-view/GanttChartView";
import { CalendarView } from "@/features/project-management/components/calendar-view/CalendarView";
import { Task, TaskStatus } from "@/types";
import { View } from "@/types";
import { ActivityLog } from "@/features/analytics/components/ActivityLog";
import { ReportingOverview } from "@/features/analytics/components/ReportingOverview";
import { DashboardList } from "@/features/analytics/components/DashboardList";
import { ListView } from "./list-view/ListView";
import React, { useMemo } from "react";

interface ProjectDetailViewProps {
  views: View[];
  tasks: Task[];
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string | null) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  emptyState: React.ReactNode;
}

function mapColumnNameToStatus(columnName: string): TaskStatus | null {
  const normalizedName = columnName.trim().toUpperCase().replace(/\s+/g, "_");
  if (normalizedName === "TO_DO") return TaskStatus.TODO;
  if (Object.values(TaskStatus).includes(normalizedName as TaskStatus)) {
    return normalizedName as TaskStatus;
  }
  return null;
}

export function ProjectDetailView({
  views,
  tasks,
  workspaceId,
  projectId,
  onTaskSelect,
  onTaskUpdate,
  activeTab,
  onTabChange,
  emptyState,
}: ProjectDetailViewProps) {
  const activeView = views.find((v) => v.id === activeTab);

  const columnStatusMap = useMemo(() => {
    if (activeView?.type !== "KANBAN" || !activeView?.columns) {
      return {};
    }
    return activeView.columns.reduce(
      (acc, col) => {
        const status = col.status || mapColumnNameToStatus(col.name);
        if (status) {
          acc[col.id] = status;
        }
        return acc;
      },
      {} as Record<string, TaskStatus>
    );
  }, [activeView]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        {views.map((view) => (
          <TabsTrigger key={view.id} value={view.id}>
            {view.name}
          </TabsTrigger>
        ))}
        <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
        <TabsTrigger value="reporting">Reporting</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      {views.map((view) => (
        <TabsContent key={view.id} value={view.id} className="mt-0 h-full">
          {view.type === "LIST" && (
            <ListView
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              emptyState={emptyState}
              showTaskTypeColumn={true}
              selectedTaskIds={[]}
              setSelectedTaskIds={() => {}}
            />
          )}
          {view.type === "KANBAN" && (
            <KanbanBoard
              scope="project"
              columns={view.columns}
              tasks={tasks}
              workspaceId={workspaceId}
              projectId={projectId}
              onTaskSelect={onTaskSelect}
              columnStatusMap={columnStatusMap}
            />
          )}
          {view.type === "GANTT" && (
            <GanttChartView tasks={tasks} onTaskSelect={onTaskSelect} />
          )}
          {view.type === "CALENDAR" && (
            <CalendarView
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
            />
          )}
        </TabsContent>
      ))}

      <TabsContent value="dashboards" className="mt-0 space-y-4">
        <DashboardList workspaceId={workspaceId} projectId={projectId} />
      </TabsContent>

      <TabsContent value="reporting" className="mt-0">
        <ReportingOverview scope={{ projectId }} />
      </TabsContent>

      <TabsContent value="activity" className="mt-0">
        <ActivityLog scope={{ projectId }} />
      </TabsContent>
    </Tabs>
  );
}