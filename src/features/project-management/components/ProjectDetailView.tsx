import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/features/project-management/components/TaskList";
import { KanbanBoard } from "@/features/project-management/components/KanbanBoard";
import { BacklogView } from "@/features/project-management/components/BacklogView";
import { GanttChartView } from "@/features/project-management/components/GanttChartView";
import { CalendarView } from "@/features/project-management/components/CalendarView";
import { Task } from "@/types";
import { View } from "@/types";
import { ActivityLog } from "@/features/analytics/components/ActivityLog";
import { ReportingOverview } from "@/features/analytics/components/ReportingOverview";
import { DashboardList } from "@/features/analytics/components/DashboardList";
import { OnChangeFn, SortingState } from "@tanstack/react-table";

interface ProjectDetailViewProps {
  views: View[];
  tasks: Task[];
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string | null) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
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
  sorting,
  setSorting,
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
            <TaskList
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              emptyState={emptyState}
              apiUrl={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
              queryKey={["tasks", projectId, view.id]}
              sorting={sorting}
              setSorting={setSorting}
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
          {view.type === "BACKLOG" && (
            <BacklogView
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
