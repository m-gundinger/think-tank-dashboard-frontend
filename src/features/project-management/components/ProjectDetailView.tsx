import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/features/project-management/components/kanban-view/KanbanBoard";
import { GanttChartView } from "@/features/project-management/components/gantt-view/GanttChartView";
import { CalendarView } from "@/features/project-management/components/calendar-view/CalendarView";
import { Task } from "@/types";
import { View } from "@/types";
import { ActivityLog } from "@/features/analytics/components/ActivityLog";
import { ReportingOverview } from "@/features/analytics/components/ReportingOverview";
import { DashboardList } from "@/features/analytics/components/DashboardList";
import { ListView } from "./list-view/ListView";
import React from "react";

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
              views={views}
              tasks={tasks}
              workspaceId={workspaceId}
              projectId={projectId}
              onTaskSelect={onTaskSelect}
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